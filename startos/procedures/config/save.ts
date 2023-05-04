import { ConfigSpec } from './spec'
import { ConfigSpecExtended, DomainWithId, WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { Effects } from '@start9labs/start-sdk/lib/types'
import { v4 as uuid } from 'uuid';

type UnionSelectKey = ConfigSpec["domains"][0]["homepage"]["unionSelectKey"] | ConfigSpec["domains"][0]["subdomains"][0]["settings"]["unionSelectKey"]
type UnionSelectValue = ConfigSpec["domains"][0]["homepage"]["unionValueKey"] | ConfigSpec["domains"][0]["subdomains"][0]["settings"]["unionValueKey"]

const handleVariantNginxConf = async (domainKey: UnionSelectKey, domainValue: UnionSelectValue, interfaceAddress: string, effects: Effects, subdomainName?: string) => {
  const address = subdomainName ? `${subdomainName}.${interfaceAddress}` : interfaceAddress
  switch (domainKey) {
    case 'web-page':
      const directory = 'folder' in domainValue ? domainValue.folder : ""
      const source = 'source' in domainValue ? domainValue.source : ""
      const toWrite = `
        server {
            autoindex on;
            listen 80;
            listen [::]:80;
            server_name ${address};
            root "/mnt/${source}/${directory}";
          }
      `
      await effects.appendFile({ path: '/etc/nginx/http.d/default.conf', volumeId: 'main', toWrite })
      break;
    case 'redirect':
      const redirectAddress = 'target' in domainValue ? `${domainValue.target}.${interfaceAddress}` : interfaceAddress
      const redirectToWrite = `
        server {
          listen 80;
          listen [::]:80;
          server_name ${address};
          return 301 http://${redirectAddress}$request_uri;
        }
      `
      await effects.appendFile({ path: '/etc/nginx/http.d/default.conf', volumeId: 'main', toWrite: redirectToWrite })
      break;
    default:
      const defaultToWrite = `
        server {
          listen 80;
          listen [::]:80;
          server_name ${address};
          root "/var/www/${domainKey}";
        }
      `
      await effects.appendFile({ path: '/etc/nginx/http.d/default.conf', volumeId: 'main', toWrite: defaultToWrite })
      break;
  }
}

export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
  input.domains.map(async domain => {
    (domain as DomainWithId).id = uuid()
    // handle homepage union selection
    if (domain.homepage.unionSelectKey === 'index') {
      if (domain.subdomains.length) {
        await effects.runCommand(['cp', '/var/www/index/index-prefix.html /var/www/index/index.html'])
        for (const sub of domain.subdomains) {
          // @TODO get tor interface for this domain
          const toWrite = `      <li><a target="_blank" href="http://${sub.name}.${tor_address}">${sub.name}</a></li>`
          // @TODO ensure correct when exists on effects
          await effects.appendFile({ path: '/var/www/index/index.html', volumeId: 'main', toWrite })
        }
      } else {
        await effects.runCommand(['cp', '/var/www/index/empty.html /var/www/index/index.html'])
      }
    } else {
      //@TODO add tor interface
      await handleVariantNginxConf(domain.homepage.unionSelectKey,  domain.homepage.unionValueKey, "REPLACE_ME", effects)
    }
    // handle subdomains if they exist
    if (domain.subdomains.length) {
      for (const subdomain of domain.subdomains) {
        // @TODO add tor interface
        await handleVariantNginxConf(subdomain.settings.unionSelectKey, subdomain.settings.unionValueKey, "REPLACE_ME", effects, subdomain.name)
      }
    }
  })
  await utils.setOwnWrapperData('/config', input as ConfigSpecExtended)
  return {
    dependenciesReceipt: await effects.setDependencies([]),
    restart: true
  }
}