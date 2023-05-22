import { sdk } from '../../sdk'
import { rmdir } from 'fs/promises'

export const v0_2_0 = sdk.Migration.of({
  version: '0.2.0',
  up: async ({ effects }) => {

    // remove old start9 dir
    await rmdir('/root/start9')
    await effects.setConfigured(false)
  },
  down: async () => { throw new Error ('Downgrade not permitted.') },
})
