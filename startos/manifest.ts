import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'start-pages',
  title: 'Start9 Pages',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/embassy-pages-wrapper',
  upstreamRepo: 'https://github.com/Start9Labs/embassy-pages-wrapper',
  supportSite:
    'https://matrix.to/#/#s9-testing-embassy-pages:matrix.start9labs.com',
  donationUrl: 'https://donate.start9.com/',
  marketingSite: 'https://start9.com',
  description: {
    short: 'Create Tor websites, hosted on your personal server.',
    long: 'Start9 Pages is a simple web server that uses folders hosted on other internal services to serve Tor websites.',
  },
  assets: [],
  volumes: ['main'],
  images: {
    'pages': {
      source: {
        dockerTag: 'nginx:1.27.3-alpine',
      },
    },
  },
  alerts: {
    install: null,
    update:
      'This major release completely changes the configuration to utilize new OS functionality. Your previous configurations will be lost, but your website data will still exist. Please reconfigure your pages using the new options.',
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    filebrowser: {
      description: 'Used to upload files to serve.',
      optional: true,
      s9pk: '../hello-world-startos/hello-world.s9pk',
    },
    nextcloud: {
      description: 'Used to upload files to serve.',
      optional: true,
      s9pk: '../hello-world-startos/hello-world.s9pk',
    },
  },
})
