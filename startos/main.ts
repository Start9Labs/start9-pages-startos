import { sdk } from './sdk'
import { appendFile } from 'fs'
import assert from 'assert'
import { uiPort } from './interfaces'
import { T } from '@start9labs/start-sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Start9 Pages...')

  const { pages } = await sdk.store
    .getOwn(effects, sdk.StorePath.config)
    .const()
  const interfaces = await sdk.serviceInterface.getAllOwn(effects).const()
  const nginxPath = '/etc/nginx/http.d/default.conf'

  appendFile(nginxPath, `server_names_hash_bucket_size 128;`, (err) =>
    assert.ifError(err),
  )

  const filebrowserMountpoint = '/mnt/filebrowser'
  const nextcloudMountpoint = '/mnt/nextcloud'

  let mounts = sdk.Mounts.of().addVolume('main', null, '/root', false)
  if (pages.some((p) => p.source === 'filebrowser')) {
    // @TODO mounts.addDependency<typeof FilebrowserManifest>
    mounts = mounts.addDependency(
      'filebrowser',
      'data',
      null,
      filebrowserMountpoint,
      true,
    )
  }
  if (pages.some((p) => p.source === 'nextcloud')) {
    // @TODO mounts.addDependency<typeof NextcloudManifest>
    mounts = mounts.addDependency(
      'nextcloud',
      'data',
      null,
      nextcloudMountpoint,
      true,
    )
  }

  for (const i of interfaces) {
    const { source, path } = pages.find((p) => p.id === i.id)!

    i.addressInfo?.hostnames.forEach((h) => {
      const toWrite = `
        server {
            autoindex on;
            listen ${uiPort};
            listen [::]:${uiPort};
            server_name ${h};
            root "${source === 'filebrowser' ? filebrowserMountpoint : nextcloudMountpoint}/${path}";
          }
        `
      appendFile(nginxPath, toWrite, (err) => assert.ifError(err))
    })
  }

  const healthReceipts: T.HealthCheck[] = []

  return sdk.Daemons.of(effects, started, healthReceipts).addDaemon('primary', {
    subcontainer: { imageId: 'pages' },
    command: ['nginx', '-g', 'daemon off;'],
    mounts,
    ready: {
      display: 'Websites Ready',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, 80, {
          successMessage: 'The web interface is ready',
          errorMessage: 'The web interface is unreachable',
        }),
    },
    requires: [],
  })
})
