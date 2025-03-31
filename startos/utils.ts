import { utils } from '@start9labs/start-sdk'
import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { sdk } from './sdk'
import { ServiceInterfaceId } from '@start9labs/start-sdk/base/lib/types'

export function getLowercaseAlphaString() {
  return utils.getDefaultString({
    charset: 'a-z',
    len: 10,
  })
}