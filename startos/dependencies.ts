import { T, VersionRange } from '@start9labs/start-sdk'
import { sdk } from './sdk'
// @TODO aiden export properly
import { Dependency } from '@start9labs/start-sdk/base/lib/dependencies/Dependency'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {

  const { pages } = await sdk.store
    .getOwn(effects, sdk.StorePath.config)
    .const()

  let currentDeps = {} as Record<'filebrowser' | 'nextcloud', Dependency>
  if (pages.some((p) => p.source === 'filebrowser')) {
    currentDeps['filebrowser'] = sdk.Dependency.of({
      type: 'exists',
      versionRange: VersionRange.parse(''),
    })
  }
  if (pages.some((p) => p.source === 'nextcloud')) {
    currentDeps['nextcloud'] = sdk.Dependency.of({
      type: 'exists',
      versionRange: VersionRange.parse(''),
    })
  }

  return currentDeps
})
