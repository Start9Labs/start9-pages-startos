import { manage } from '../actions/manage'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const taskCreateSite = sdk.setupOnInit(async (effects) => {
  const pages = await storeJson.read((s) => s.pages).const(effects)

  if (!pages?.length) {
    await sdk.action.createOwnTask(effects, manage, 'critical', {
      reason: 'Add your first website!',
    })
  }
})
