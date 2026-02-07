import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

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
    'https://github.com/Start9Labs/start9-pages-startos/blob/master/INSTRUCTIONS.md',
  description: i18n.description,
  volumes: ['main'],
  images: {
    pages: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
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
