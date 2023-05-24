import { sdk } from '../sdk'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { appendFile } from 'fs'
import assert from 'assert'
import { dependencyMounts } from './dependencies/dependencyMounts'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { checkPortListening } from '@start9labs/start-sdk/lib/health/checkFns'
import { uiPort } from './interfaces'

export const main = sdk.setupMain(async ({ effects, utils, started }) => {
  console.info('Starting Start9 Pages...')

  const { pages } = await utils.store.getOwn('/config').once()

  const nginxPath = '/etc/nginx/http.d/default.conf'

  appendFile(nginxPath, `server_names_hash_bucket_size 128;`, (err) =>
    assert.ifError(err),
  )

  const interfaces = await utils.networkInterface.getAllOwn().once()

  for (const iFace of interfaces) {
    const { source, path } = pages.find((p) => p.label === iFace.name)!
    const mountpoint = `${
      source === 'filebrowser'
        ? await utils.mountDependencies(
            dependencyMounts.filebrowser.main.dataDir,
          )
        : await utils.mountDependencies(
            dependencyMounts.nextcloud.main.filesDir,
          )
    }/${path}`
    iFace.hostnames.forEach((h) => {
      const toWrite = `
        server {
            autoindex on;
            listen ${uiPort};
            listen [::]:${uiPort};
            server_name ${h};
            root "${mountpoint}";
          }
        `
      appendFile(nginxPath, toWrite, (err) => assert.ifError(err))
    })
  }

  return Daemons.of({
    effects,
    started,
    healthReceipts: [],
  }).addDaemon('hosting-instance', {
    command: ['nginx', '-g', 'daemon off;'],
    ready: {
      display: 'Hosting Instance',
      fn: () =>
        checkPortListening(effects, uiPort, {
          successMessage: 'Page hosting is fully operational',
          errorMessage: 'Page hosting is not functional',
        }),
    },
    requires: [],
  })
})
