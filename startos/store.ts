import { setupExposeStore } from '@start9labs/start-sdk'
import { ConfigSpec } from './actions/config/spec'

export type Store = { config: ConfigSpec, ports: number[] }

export const initStore: Store = { config: { pages: [] }, ports: [] }

export const exposedStore = setupExposeStore<Store>(() => [])
