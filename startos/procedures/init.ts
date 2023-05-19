import { setupInterfaces } from '@start9labs/start-sdk/lib/interfaces/setupInterfaces'
import { sdk } from '../sdk'
import { migrations } from './migrations'

const install = sdk.setupInstall(async ({ effects, utils }) => {})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

/**
 * This is a static function. There is no need to make changes here
 */
export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setupInterfaces,
)
