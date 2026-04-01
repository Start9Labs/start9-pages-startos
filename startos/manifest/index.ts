import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

export const manifest = setupManifest({
  id: 'start9-pages',
  title: 'Start9 Pages',
  license: 'mit',
  packageRepo: 'https://github.com/Start9Labs/start9-pages-startos',
  upstreamRepo: 'https://github.com/Start9Labs/start9-pages-startos',
  donationUrl: 'https://donate.start9.com/',
  marketingUrl: 'https://github.com/Start9Labs/start9-pages-startos',
  docsUrls: ['https://github.com/Start9Labs/start9-pages-startos'],
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
      description: i18n.depFilebrowserDescription,
      optional: true,
      metadata: {
        title: 'File Browser',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-startos/refs/heads/master/icon.svg',
      },
    },
    nextcloud: {
      description: i18n.depNextcloudDescription,
      optional: true,
      metadata: {
        title: 'Nextcloud',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextcloud-startos/a23fcbd16bd97be794401e368f078209d5ebc88c/icon.svg',
      },
    },
  },
})
