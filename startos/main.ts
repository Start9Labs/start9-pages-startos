import { createHash } from 'crypto'
import { manifest as FilebrowserManifest } from 'filebrowser-startos/startos/manifest'
import { manifest as NextcloudManifest } from 'nextcloud-startos/startos/manifest'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Start9 Pages...'))

  // Reactive nginx daemon: the stored `pages` list is read INSIDE the builder,
  // where `constRetry` drives a reconcile rather than firing `effects.restart()`
  // — so adding, removing, or editing a page updates the daemon in place and the
  // service stays `running`. nginx serves every page from one process (all
  // `listen` ports live in a single config), so a single reconciled daemon is the
  // right shape: per-page daemons would mean N nginx containers each binding one
  // of the MultiHost ports, more moving parts for no correctness gain. What the
  // reconciler must react to is surfaced through HASHED fields — the dependency
  // mounts ride in the subcontainer descriptor, and the effective nginx config
  // content rides in `exec.env.CONF_HASH` — so nginx restarts exactly when a page
  // add/remove/edit changes the config it serves.
  return sdk.Daemons.dynamic(effects, async ({ effects }) => {
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

    const serverBlocks: string[] = [
      `server {
    listen 80;
    listen [::]:80;
    server_name _;
    return 444; # silently close connection
}`,
    ]

    for (const page of pages) {
      const { source, port, cors } = page

      const root =
        source.selection === 'nextcloud'
          ? `${nextcloudMountpoint}/data/${source.value.user}/files/${source.value.path}`
          : `${filebrowserMountpoint}/${source.value.path}`

      // Adding any `add_header` in a server block replaces the http-level set
      // for that server, so when CORS is on we repeat the security headers.
      const corsHeaders = cors
        ? `
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header X-XSS-Protection "1; mode=block";
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
    add_header Access-Control-Allow-Headers "*";`
        : ''

      const block = `server {
    listen ${port};
    listen [::]:${port};
    server_name _;
    root ${root};
    index index.html index.htm;${corsHeaders}
    location / {
        try_files $uri $uri/ =404;
        autoindex on;
    }
}`
      serverBlocks.push(block)
    }

    const defaultConf = serverBlocks.join('\n\n')

    // The daemon runs off a lazy subcontainer, so the config can't be written
    // into its rootfs from here. Instead we write it to the `main` volume (also
    // mounted at /data in the container) and point nginx at it with `-c`. A
    // sha256 of the effective config rides in `exec.env.CONF_HASH`, which the
    // reconciler hashes — so nginx restarts precisely when the config changes.
    await sdk.volumes.main.writeFile('nginx/nginx.conf', nginxFile)
    await sdk.volumes.main.writeFile('nginx/conf.d/default.conf', defaultConf)

    const confHash = createHash('sha256')
      .update(nginxFile)
      .update(defaultConf)
      .digest('hex')

    /**
     *  ======================== Daemons ========================
     */
    return sdk.Daemons.of(effects).addDaemon('primary', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'pages' },
        mounts,
        'primary',
      ),
      exec: {
        command: ['nginx', '-c', '/data/nginx/nginx.conf', '-g', 'daemon off;'],
        env: { CONF_HASH: confHash },
      },
      ready: {
        display: i18n('Hosting'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 80, {
            successMessage: i18n('Ready to serve web pages'),
            errorMessage: i18n('Unavailable'),
          }),
      },
      requires: [],
    })
  })
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
    server_names_hash_max_size 2048;
    server_names_hash_bucket_size 256;

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

    include /data/nginx/conf.d/*.conf;
}`
