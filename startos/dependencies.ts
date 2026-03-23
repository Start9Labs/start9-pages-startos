import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const pages = (await storeJson.read((s) => s.pages).const(effects)) || []

  const deps: T.CurrentDependenciesResult<any> = {}

  if (pages.some((p) => p.source.selection === 'filebrowser')) {
    deps['filebrowser'] = {
      kind: 'exists',
      versionRange: '>=2.62.1:0-beta.2',
    }
  }
  if (pages.some((p) => p.source.selection === 'nextcloud')) {
    deps['nextcloud'] = {
      kind: 'exists',
      versionRange: '>=32.0.6:2-beta.5',
    }
  }

  return deps
})
