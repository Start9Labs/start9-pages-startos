import { sdk } from './sdk'
import { writeFile } from 'fs/promises'
import { manifest as FilebrowserManifest } from 'filebrowser-startos/startos/manifest'
import { manifest as NextcloudManifest } from 'nextcloud-startos/startos/manifest'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting Start9 Pages...')

  const pages = (await storeJson.read((s) => s.pages).const(effects)) || []

  // ========================
  // Handle dependency mounts
  // ========================

  const filebrowserMountpoint = '/mnt/filebrowser'
  const nextcloudMountpoint = '/mnt/nextcloud'

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })

  if (pages.some((p) => p.source.selection === 'filebrowser')) {
    mounts = mounts.mountDependency<typeof FilebrowserManifest>({
      dependencyId: 'filebrowser',
      volumeId: 'data',
      subpath: null,
      mountpoint: filebrowserMountpoint,
      readonly: true,
    })
  }
  if (pages.some((p) => p.source.selection === 'nextcloud')) {
    mounts = mounts.mountDependency<typeof NextcloudManifest>({
      dependencyId: 'nextcloud',
      volumeId: 'nextcloud',
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

  await writeFile(nginxConf, nginxFile)

  const serverBlocks: string[] = [
    `server {
    listen 80;
    listen [::]:80;
    server_name _;
    return 444; # silently close connection
}`,
  ]

  for (const page of pages) {
    const { source, port } = page

    const root =
      source.selection === 'nextcloud'
        ? `${nextcloudMountpoint}/data/${source.value.user}/files/${source.value.path}`
        : `${filebrowserMountpoint}/${source.value.path}`

    const block = `server {
    listen ${port};
    listen [::]:${port};
    server_name _;
    root ${root};
    index index.html index.htm;
    location / {
        try_files $uri $uri/ =404;
        autoindex on;
    }
}`
    serverBlocks.push(block)
  }

  // Write to file
  await writeFile(nginxDefaultConf, serverBlocks.join('\n\n'))

  /**
   *  ======================== Daemons ========================
   */
  const daemon = sdk.Daemons.of(effects).addDaemon('primary', {
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

const nginxFile = `user  nginx;
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

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 10000;
    types_hash_max_size 4096;
    server_names_hash_bucket_size 128;

    access_log  /var/log/nginx/access.log  main;

    brotli on;
    brotli_comp_level 5;           # 1–11, 4–6 is a good balance
    brotli_static on;              # serve precompressed .br files if present
    brotli_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml
        font/woff
        font/woff2;

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_min_length 1024;
    gzip_http_version 1.1;

    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/xml+rss
        application/atom+xml
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype
        image/svg+xml
        application/x-font-woff
        application/font-woff
        application/font-woff2;

    # Cache static assets for 30 days
    map $sent_http_content_type $expires {
        "~*text/html"                 off;      # never cache HTML
        "~*application/json"          off;      # usually dynamic
        "~*text/javascript"           max;      # hash-named JS
        "~*application/javascript"    max;
        "~*text/css"                  max;      # hash-named CSS
        "~*image/"                    max;
        "~*font/"                     max;
        default                       7d;
    }
    expires $expires;

    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header X-XSS-Protection "1; mode=block";

    include /etc/nginx/conf.d/*.conf;
}`
