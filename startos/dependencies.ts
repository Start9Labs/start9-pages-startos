import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { store } from './file-models/store.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const pages = (await store.read((s) => s.pages).const(effects)) || []

  let currentDeps = {} as Record<
    'filebrowser' | 'nextcloud',
    T.DependencyRequirement
  >
  if (pages.some((p) => p.source.selection === 'filebrowser')) {
    currentDeps['filebrowser'] = {
      id: 'filebrowser',
      kind: 'exists',
      versionRange: '>=2.31.2:1',
    }
  }
  if (pages.some((p) => p.source.selection === 'nextcloud')) {
    currentDeps['nextcloud'] = {
      id: 'nextcloud',
      kind: 'exists',
      versionRange: '>=27.1.7:1', //@TODO confirm
    }
  }

  return currentDeps
})
