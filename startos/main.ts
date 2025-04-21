import { sdk } from './sdk'
import { SubContainer, T } from '@start9labs/start-sdk'
import { writeFile, appendFile } from 'fs/promises'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Start9 Pages...')

  const config = await sdk.store.getOwn(effects, sdk.StorePath.config).const()

  const filebrowserMountpoint = '/mnt/filebrowser'
  const nextcloudMountpoint = '/mnt/nextcloud'

  let mounts = sdk.Mounts.of().addVolume('main', null, '/root', false)

  if (config.pages.some((p) => p.source === 'filebrowser')) {
    // @TODO mounts = mounts.addDependency<typeof FilebrowserManifest>
    mounts = mounts.addDependency(
      'filebrowser',
      'main',
      'files',
      filebrowserMountpoint,
      true,
    )
  }
  if (config.pages.some((p) => p.source === 'nextcloud')) {
    // @TODO mounts.addDependency<typeof NextcloudManifest>
    mounts = mounts.addDependency(
      'nextcloud',
      'main',
      null,
      nextcloudMountpoint,
      true,
    )
  }

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

  for (const i of interfaces) {
    const { source, path } = config.pages.find((p) => p.id === i.id)!
    i.addressInfo?.hostnames.forEach(async (h) => {
      let hostname
      let port
      if (h.kind === 'onion') {
        hostname = h.hostname.value
        port = h.hostname.sslPort
      } else if (h.hostname.kind === 'domain') {
        hostname = `${h.hostname.subdomain}.${h.hostname.domain}`
        port = h.hostname.sslPort
      } else {
        hostname = h.hostname.value
        port = h.hostname.sslPort
      }
      const toWrite = `
          server {
              autoindex on;
              listen ${port};
              listen [::]:${port};
              server_name ${hostname};
              root ${source === 'filebrowser' ? filebrowserMountpoint : nextcloudMountpoint}/${path};
            }
          `
      try {
        await appendFile(nginxDefaultConf, toWrite)
      } catch (e) {
        throw e
      }
    })
  }

  const additionalChecks: T.HealthCheck[] = []

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
