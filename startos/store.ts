import { setupExposeStore } from '@start9labs/start-sdk'
import { ConfigSpec } from './actions/config/spec'

export type Store = {
  config: ConfigSpec
}

export const exposedStore = setupExposeStore<Store>(() => [])