import { properties } from './properties'
import { sdk } from '../sdk'
import { config } from './config/config'

export const actions = sdk.Actions.of()
  .addAction(config)
  .addAction(properties)
