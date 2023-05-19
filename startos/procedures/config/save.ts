import { Dependency } from '@start9labs/start-sdk/lib/types'
import { sdk } from '../../sdk'
import { configSpec } from './spec'
import { setInterfaces } from '../interfaces'

export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, utils, input, dependencies }) => {
    await utils.store.setOwn('/config', input)

    const pages = input.pages

    // determine dependencies
    let currentDeps: Dependency[] = []
    if (pages.some((p) => p.source === 'filebrowser')) {
      currentDeps.push(dependencies.exists('filebrowser'))
    }
    if (pages.some((p) => p.source === 'nextcloud')) {
      currentDeps.push(dependencies.exists('nextcloud'))
    }

    return {
      interfacesReceipt: await setInterfaces({ effects, utils, input }), // This is plumbing, don't touch it
      dependenciesReceipt: await effects.setDependencies(currentDeps),
      restart: true,
    }
  },
)
