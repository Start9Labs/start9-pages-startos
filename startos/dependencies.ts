import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const pages = (await storeJson.read((s) => s.pages).const(effects)) || []

  const currentDeps = {} as Record<
    'filebrowser' | 'nextcloud',
    T.DependencyRequirement
  >
  if (pages.some((p) => p.source.selection === 'filebrowser')) {
    currentDeps['filebrowser'] = {
      id: 'filebrowser',
      kind: 'exists',
      versionRange: '>=2.52.0:2-beta.0',
    }
  }
  if (pages.some((p) => p.source.selection === 'nextcloud')) {
    currentDeps['nextcloud'] = {
      id: 'nextcloud',
      kind: 'exists',
      versionRange: '>=31.0.12:2-alpha.0',
    }
  }

  return currentDeps
})
