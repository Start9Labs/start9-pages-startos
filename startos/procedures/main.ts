import { checkPortListening } from '@start9labs/start-sdk/lib/health/checkFns'
import exportInterfaces from '@start9labs/start-sdk/lib/mainFn/exportInterfaces'
import { Effects, ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { DomainConfigWithId, Page, SubdomainConfigWithId, WrapperData } from '../wrapperData'
import { NetworkInterfaceBuilder } from '@start9labs/start-sdk/lib/mainFn/NetworkInterfaceBuilder'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { setupMain } from '@start9labs/start-sdk/lib/mainFn'
import { AddressReceipt } from '@start9labs/start-sdk/lib/mainFn/AddressReceipt'
import { Utils } from '@start9labs/start-sdk/lib/util'
import { appendFile, copyFile} from 'fs'
import assert from 'assert'

const configureTor = (page: DomainConfigWithId | SubdomainConfigWithId) => async (utils: Utils<WrapperData, {}>, effects: Effects) => {
  const isDomain = (x: any): x is DomainConfigWithId => x.label;
  const name = isDomain(page) ? (page as DomainConfigWithId).label : (page as SubdomainConfigWithId).name
  const id = page.id
  // Find or generate a random Tor hostname by ID
  const torHostname = utils.torHostName(`${id}`)
  // Create a Tor host with the assigned port mapping
  const torHostHttp = await torHostname.bindTor(8080, 80)
  // Assign the Tor host a web protocol (e.g. "http", "ws")
  const torOriginHttp = torHostHttp.createOrigin('http')
  // Create another Tor host with the assigned port mapping
  const torHostHttps = await torHostname.bindTor(8443, 443)
  // Assign the Tor host a web protocol (e.g. "https", "wss")
  const torOriginHttps = torHostHttps.createOrigin('https')
  // Define the Interface for user display and consumption
  const webInterface = new NetworkInterfaceBuilder({
    effects,
    name: `Web UI for ${name}`,
    id: `webui-${id}`,
    description: `The web interface for ${name}`,
    ui: true,
    username: null,
    path: '',
    search: {},
  })
  return {
    torHostname: torHostname.id,
    webInterface,
    torOriginHttp,
    torOriginHttps
  }
}

const handleVariantNginxConf = async(page: Page, interfaceAddress: string, subdomainName?: string) => {
  const address = subdomainName ? `${subdomainName}.${interfaceAddress}` : interfaceAddress
  const pageType = page.unionSelectKey
  const pageDetails = page.unionValueKey

  switch (pageType) {
    case 'web-page':
      if ('folder' in pageDetails && 'source' in pageDetails) {
        const toWrite = `
          server {
              autoindex on;
              listen 80;
              listen [::]:80;
              server_name ${address};
              root "/mnt/${pageDetails.source}/${pageDetails.folder}";
            }
        `
        await appendFile('/etc/nginx/http.d/default.conf', toWrite, err => assert.ifError(err))
      }
      break;
    case 'redirect':
      const redirectAddress = 'target' in pageDetails ? `${pageDetails.target}.${interfaceAddress}` : interfaceAddress
      const redirectToWrite = `
        server {
          listen 80;
          listen [::]:80;
          server_name ${address};
          return 301 http://${redirectAddress}$request_uri;
        }
      `
      await appendFile('/etc/nginx/http.d/default.conf', redirectToWrite, err => assert.ifError(err))
      break;
    default:
      const defaultToWrite = `
        server {
          listen 80;
          listen [::]:80;
          server_name ${address};
          root "/var/www/${pageType}";
        }
      `
      await appendFile('/etc/nginx/http.d/default.conf', defaultToWrite, err => assert.ifError(err))
      break;
  }
}

export const main: ExpectedExports.main = setupMain<WrapperData>(
  async ({ effects, utils, started }) => {
    const healthReceipts: HealthReceipt[] = []
    const config = await effects.getWrapperData<WrapperData, '/config'>({ path: '/config', callback: () => {} })
    const addressReceipts: AddressReceipt[] = []
    const bucketSize = 128

    await console.info('Starting Start9 Pages...')

    await appendFile('/etc/nginx/http.d/default.conf', `server_names_hash_bucket_size ${bucketSize};`, err => assert.ifError(err))
    
    effects.mount({
      location: {
        volumeId: 'mnt',
        path: '/filebrowser',
      },
      target: {
        packageId: 'filebrowser',
        volumeId: 'main',
        path: '/data',
        readonly: true,
      },
    })

    effects.mount({
      location: {
        volumeId: 'mnt',
        path: '/nextcloud',
      },
      target: {
        packageId: 'nextcloud',
        volumeId: 'main',
        path: '/data/embassy/files',
        readonly: true,
      },
    })
    
    for (const domain of config.domains) {
      const { torHostname, webInterface, torOriginHttp, torOriginHttps } = await configureTor(domain)(utils, effects)
      addressReceipts.push(await webInterface.export([torOriginHttp, torOriginHttps]))

      if (domain.homepage.unionSelectKey === 'index') {
        await copyFile('/var/www/index/empty.html', '/var/www/index/index.html', err => assert.ifError(err))
      } else {
        await handleVariantNginxConf(domain.homepage, torHostname)
      }

      if (domain.subdomains.length) {
        await copyFile('/var/www/index/index-prefix.html', '/var/www/index/index.html', err => assert.ifError(err))
        for (const subdomain of domain.subdomains) {
          if (domain.homepage.unionSelectKey === 'index') {
            const toWrite = `      <li><a target="_blank" href="http://${subdomain.name}.${torHostname}">${subdomain.name}</a></li>`
            await appendFile('/var/www/index/index.html', toWrite, err => assert.ifError(err))
          } else {
            await handleVariantNginxConf(subdomain.settings, torHostname, subdomain.name)
          }
        }
      }
    }

    return Daemons.of({
      effects,
      started,
      interfaceReceipt: exportInterfaces(addressReceipts),
      healthReceipts,
    }).addDaemon('hosting-instance', {
      command: ['nginx', '-g', 'daemon off;'],
      ready: {
        display: 'Hosting Instance',
        fn: () =>
          checkPortListening(effects, 8080, {
            timeout: 10_000,
            successMessage: 'Page hosting is fully operational',
            errorMessage: 'Page hosting is not functional',
          }),
      },
      requires: [],
    })
  }
)
