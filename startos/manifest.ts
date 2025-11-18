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
    short: 'A simple service for self-hosting static websites',
    long: 'Self-host any number of static websites right from your StartOS server. Expose your websites over Tor, Clearnet, or both.',
  },
  volumes: ['main'],
  images: {
    pages: {
      source: {
        dockerTag: 'fholzer/nginx-brotli',
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
      'This release is not backwards compatible. Updating will cause your current websites to go offline. Your website data, however, will remain as-is in File Browser or NextCloud. Simply reconfigure your pages using the new options.',
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    filebrowser: {
      description: 'Used for storing static website files',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/filebrowser-startos/releases/download/v2.32.0-040/filebrowser.s9pk',
    },
    nextcloud: {
      description: 'Used for storing static website files',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/nextcloud-startos/releases/download/v29.0.14.1/nextcloudV2.s9pk',
    },
  },
})
