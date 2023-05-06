import { ConfigSpec } from './config/spec'
import { WrapperData } from '../wrapperData'
import { Manifest } from '../manifest'
import { setupAutoConfig } from '@start9labs/start-sdk/lib/autoconfig/setupAutoConfig'
import { ConfigSpec as FilebrowserSpec } from 'filebrowser-wrapper/startos/procedures/config/spec'
import { ConfigSpec as NextcloudSpec } from 'nextcloud-wrapper/startos/procedures/config/spec'

/**
 * In this function, you establish rules for auto configuring service dependencies
 *
 * See Hello Moon for an example
 */
export const autoConfig = setupAutoConfig<
  WrapperData,
  ConfigSpec,
  Manifest,
  { 
    filebrowser: FilebrowserSpec,
    nextcloud: NextcloudSpec
  }
>({
    filebrowser: async ({ effects, utils, localConfig, remoteConfig }) => {},
    nextcloud: async ({ effects, utils, localConfig, remoteConfig }) => {},
})
