import { sdk } from './sdk'
import { SubContainer, T } from '@start9labs/start-sdk'
import { writeFile, appendFile } from 'fs/promises'
import { manifest as FilebrowserManifest } from 'filebrowser-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Additional Health Checks (optional) ========================
   */
  const additionalChecks: T.HealthCheck[] = []
  /**
   * ======================== Setup ========================
   */
  console.info('Starting Start9 Pages...')

  // const depResult = await sdk.checkDependencies(effects)
  // depResult.throwIfNotSatisfied()

  const config = await sdk.store.getOwn(effects, sdk.StorePath.config).const()

  // ========================
  // Handle dependency mounts
  // ========================

  const filebrowserMountpoint = '/mnt/filebrowser'
  const nextcloudMountpoint = '/mnt/nextcloud'

  let mounts = sdk.Mounts.of().addVolume('main', null, '/root', false)

  if (config.pages.some((p) => p.source.selection === 'filebrowser')) {
    mounts = mounts.addDependency<typeof FilebrowserManifest>(
      'filebrowser',
      'main',
      'files',
      filebrowserMountpoint,
      true,
    )
  }
  if (config.pages.some((p) => p.source.selection === 'nextcloud')) {
    // @TODO mounts.addDependency<typeof NextcloudManifest>
    mounts = mounts.addDependency(
      'nextcloud',
      'main',
      null,
      nextcloudMountpoint,
      true,
    )
  }

  // ========================
  // Setup nginx
  // ========================

  const pagesSub = await SubContainer.of(
    effects,
    { imageId: 'pages' },
    mounts,
    'primary',
  )

  const nginxDefaultConf = `${pagesSub.rootfs}/etc/nginx/conf.d/default.conf`
  const nginxConf = `${pagesSub.rootfs}/etc/nginx/nginx.conf`

  try {
    await writeFile(
      nginxConf,
      `
      user  nginx;
      worker_processes  auto;
  
      error_log  /var/log/nginx/error.log notice;
      pid        /var/run/nginx.pid;
  
      events {
        worker_connections  1024;
      }
  
      http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;
        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';
  
        access_log  /var/log/nginx/access.log  main;
        sendfile        on;
        #tcp_nopush     on;
        keepalive_timeout  65;
        #gzip  on;
        server_names_hash_bucket_size 128;
        include /etc/nginx/conf.d/*.conf;
      }`,
    )
  } catch (e) {
    throw e
  }
  const interfaces = await sdk.serviceInterface.getAllOwn(effects).const()
  const serverBlocks: string[] = []

  for (const i of interfaces) {
    const page = config.pages.find((p: any) => p.id === i.id)
    if (!page) continue

    const { source, port, label, id } = page
    const block = `
server {
    listen ${port};
    listen [::]:${port};
    server_name _;
    root ${source.selection === 'filebrowser' ? filebrowserMountpoint : nextcloudMountpoint}/${source.value.path};
    index index.html index.htm;
    location / {
        try_files $uri $uri/ =404;
    }
}
`
    serverBlocks.push(block)
    const healthCheck = sdk.HealthCheck.of(effects, {
      id: `${id}-health-check`,
      name: `${label}`,
      fn: async () =>
        sdk.healthCheck.checkPortListening(effects, port, {
          successMessage: `Running`,
          errorMessage: `Unavailable`,
        }),
    })
    additionalChecks.push(healthCheck)
  }

  // Write to file
  try {
    await appendFile(nginxDefaultConf, serverBlocks.join('\n\n'))
  } catch (e) {
    throw e
  }

  /**
   *  ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects, started, additionalChecks).addDaemon(
    'primary',
    {
      subcontainer: pagesSub,
      command: ['nginx', '-g', 'daemon off;'],
      ready: {
        display: 'Hosting',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 80, {
            successMessage: 'Ready to serve web pages',
            errorMessage: 'Unavailable',
          }),
      },
      requires: [],
    },
  )
})
