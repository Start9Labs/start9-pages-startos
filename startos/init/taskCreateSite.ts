import { manage } from '../actions/manage'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

export const taskCreateSite = sdk.setupOnInit(async (effects) => {
  const pages = await storeJson.read((s) => s.pages).const(effects)

  if (!pages?.length) {
    await sdk.action.createOwnTask(effects, manage, 'critical', {
      reason: i18n('Add your first website!'),
    })
  }
})
