import { sdk } from '../../sdk'
import { configSpec } from './spec'

export const read = sdk.setupConfigRead(
  configSpec,
  async ({ effects, utils }) => {
    return utils.store.getOwn('/config').once()
  },
)
