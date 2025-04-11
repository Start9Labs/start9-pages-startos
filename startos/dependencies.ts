import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const config = await sdk.store.getOwn(effects, sdk.StorePath.config).const()
  if (!config || !config.pages)
    await sdk.store.setOwn(effects, sdk.StorePath, { config: { pages: [] } })

  let currentDeps = {} as Record<
    'filebrowser' | 'nextcloud',
    T.DependencyRequirement
  >
  if (config.pages.some((p) => p.source === 'filebrowser')) {
    currentDeps['filebrowser'] = {
      id: 'filebrowser',
      kind: 'exists',
      versionRange: '>=2.31.2:1',
    }
  }
  if (config.pages.some((p) => p.source === 'nextcloud')) {
    currentDeps['nextcloud'] = {
      id: 'nextcloud',
      kind: 'exists',
      versionRange: '>=27.1.7:1', //@TODO confirm
    }
  }

  return currentDeps
})
