import { sdk } from './sdk'
import { writeFile, appendFile } from 'fs/promises'
import { manifest as FilebrowserManifest } from 'filebrowser-startos/startos/manifest'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting Start9 Pages...')

  const pages = (await storeJson.read((s) => s.pages).const(effects)) || []

  console.log('*** PAGES *** ', JSON.stringify(pages))

  // =================
  // Dependency checks
  // =================

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  // ========================
  // Handle dependency mounts
  // ========================

  const filebrowserMountpoint = '/mnt/filebrowser'
  const nextcloudMountpoint = '/mnt/nextcloud'

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/root',
    readonly: false,
  })

  if (pages.some((p) => p.source.selection === 'filebrowser')) {
    mounts = mounts.mountDependency<typeof FilebrowserManifest>({
      dependencyId: 'filebrowser',
      volumeId: 'main',
      subpath: 'files',
      mountpoint: filebrowserMountpoint,
      readonly: true,
    })
  }
  if (pages.some((p) => p.source.selection === 'nextcloud')) {
    // @TODO
    // mounts = mounts.mountDependency<typeof NextcloudManifest>
    mounts = mounts.mountDependency({
      dependencyId: 'nextcloud',
      volumeId: 'main',
      subpath: null,
      mountpoint: nextcloudMountpoint,
      readonly: true,
    })
  }

  // ===========
  // Setup nginx
  // ===========

  const pagesSub = await sdk.SubContainer.of(
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
  const serverBlocks: string[] = []

  for (const page of pages) {
    const { source, port } = page

    const block = `
server {
    listen ${port};
    listen [::]:${port};
    server_name _;
    root ${source.selection === 'filebrowser' ? filebrowserMountpoint : nextcloudMountpoint}/${source.value.path};
    index index.html index.htm;
    location / {
        try_files $uri $uri/ =404;
        autoindex on;
    }
}
`
    serverBlocks.push(block)
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
  const daemon = sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: pagesSub,
    exec: {
      command: ['nginx', '-g', 'daemon off;'],
    },
    ready: {
      display: 'Hosting',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, 80, {
          successMessage: 'Ready to serve web pages',
          errorMessage: 'Unavailable',
        }),
    },
    requires: [],
  })

  return daemon
})
