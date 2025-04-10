import { setupExposeStore } from '@start9labs/start-sdk'
import { ConfigSpec } from './actions/config/spec'

export type Store = {
  config: ConfigSpec
}

export const initStore: Store = {
  config: { 
    pages: []
  }
}

export const exposedStore = setupExposeStore<Store>(() => [])