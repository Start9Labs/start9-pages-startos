import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { storeJson } from '../../fileModels/store.json'
import * as fs from 'fs/promises'

export const v1_0_0_0_a1 = VersionInfo.of({
  version: '1.0.0:0-alpha.1',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      await storeJson.write(effects, { pages: [] })

      await fs
        .rm('/media/startos/volumes/main/start9', { recursive: true })
        .catch(console.error)
    },
    down: IMPOSSIBLE,
  },
})
