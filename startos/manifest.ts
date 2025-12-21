import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'start9-pages',
  title: 'Start9 Pages V2',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/start9-pages-startos',
  upstreamRepo: 'https://github.com/Start9Labs/start9-pages-startos',
  supportSite: 'https://matrix.to/#/#start9-pages:start9.me',
  donationUrl: 'https://donate.start9.com/',
  marketingSite: 'https://github.com/Start9Labs/start9-pages-startos',
  docsUrl:
    'https://github.com/Start9Labs/start9-pages-startos/blob/master/docs/instructions.md',
  description: {
    short: 'Self-host static websites',
    long: 'Self-host any number of static websites right from your StartOS server. Expose your websites over Tor, Clearnet, or both.',
  },
  volumes: ['main'],
  images: {
    pages: {
      source: {
        dockerTag: 'fholzer/nginx-brotli',
      },
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    filebrowser: {
      description: 'Used for storing static website files',
      optional: true,
      metadata: {
        title: 'File Browser',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-startos/refs/heads/master/icon.png',
      },
    },
    nextcloud: {
      description: 'Used for storing static website files',
      optional: true,
      metadata: {
        title: 'Nextcloud',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextcloud-startos/refs/heads/master/icon.png',
      },
    },
  },
})
