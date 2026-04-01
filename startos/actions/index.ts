import { sdk } from '../sdk'
import { manage } from './manage'

export const actions = sdk.Actions.of().addAction(manage)
