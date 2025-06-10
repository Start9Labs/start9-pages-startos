import { config } from '../actions/config'
import { sdk } from '../sdk'

export const taskCreateSite = sdk.setupOnInit(async (effects) => {
  await sdk.action.createOwnTask(effects, config, 'optional', {
    reason: 'Create your first website!',
  })
})
