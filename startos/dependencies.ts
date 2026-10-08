import { T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import i18n from './manifest/i18n'
import { sdk } from './sdk'

const isSource = async (
  effects: T.Effects,
  source: 'filebrowser' | 'nextcloud' | 'nextexplorer',
) =>
  !!(await storeJson.read((s) => s.pages).const(effects))?.some(
    (p) => p.source.selection === source,
  )

export const dependencies = sdk.Dependencies.of()
  .addDependency(
    sdk.Dependency.optional('filebrowser', {
      description: i18n.depFilebrowserDescription,
      metadata: {
        title: 'FileBrowser Quantum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-quantum-startos/e936a6c85a97b930b43cad5e9c0dd4898a2df567/icon.svg',
      },
      versionRange: '>=2.63.18:3',
      kind: 'exists',
      enabled: ({ effects }) => isSource(effects, 'filebrowser'),
    }),
  )
  .addDependency(
    sdk.Dependency.optional('nextcloud', {
      description: i18n.depNextcloudDescription,
      metadata: {
        title: 'Nextcloud',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextcloud-startos/a23fcbd16bd97be794401e368f078209d5ebc88c/icon.svg',
      },
      versionRange: '>=33.0.6:1',
      kind: 'exists',
      enabled: ({ effects }) => isSource(effects, 'nextcloud'),
    }),
  )
  .addDependency(
    sdk.Dependency.optional('nextexplorer', {
      description: i18n.depNextexplorerDescription,
      metadata: {
        title: 'NextExplorer',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextexplorer-startos/04f7ecbfc31ad2205e0222dd7568fb881aa06c79/icon.svg',
      },
      versionRange: '>=2.2.7:0',
      kind: 'exists',
      enabled: ({ effects }) => isSource(effects, 'nextexplorer'),
    }),
  )
