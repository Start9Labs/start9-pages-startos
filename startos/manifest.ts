import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const arch =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'start9-pages',
  title: 'Start9 Pages',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/start9-pages-startos',
  upstreamRepo: 'https://github.com/Start9Labs/start9-pages-startos',
  supportSite: 'https://matrix.to/#/#start9-pages:start9.me',
  donationUrl: 'https://donate.start9.com/',
  marketingSite: 'https://start9.com',
  docsUrl:
    'https://github.com/Start9Labs/start9-pages-startos/blob/master/docs/instructions.md',
  description: {
    short: 'Create websites, hosted on your personal server.',
    long: 'Start9 Pages is a simple web server that uses folders hosted on other internal services to serve websites over Tor and clearnet.',
  },
  volumes: ['main'],
  images: {
    pages: {
      source: {
        dockerTag: 'nginx:stable-alpine',
      },
      arch,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch,
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
      s9pk: 'https://github.com/Start9Labs/filebrowser-startos/releases/download/v2.32.0-040/filebrowser.s9pk',
    },
    nextcloud: {
      description: 'Used to upload files to serve.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/nextcloud-startos/releases/download/v29.0.14.1/nextcloudV2.s9pk',
    },
  },
})
