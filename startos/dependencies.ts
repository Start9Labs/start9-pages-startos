import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const pages = (await storeJson.read((s) => s.pages).const(effects)) || []

  const deps: T.CurrentDependenciesResult<any> = {}

  if (pages.some((p) => p.source.selection === 'filebrowser')) {
    deps['filebrowser'] = {
      kind: 'exists',
      versionRange: '>=2.52.0:3-beta.0',
    }
  }
  if (pages.some((p) => p.source.selection === 'nextcloud')) {
    deps['nextcloud'] = {
      kind: 'exists',
      versionRange: '>=31.0.12:0-beta.0',
    }
  }

  return deps
})
