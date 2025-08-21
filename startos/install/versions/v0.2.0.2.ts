import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import * as fs from 'fs/promises'

export const v0_2_0_2 = VersionInfo.of({
  version: '0.2.0:2-alpha.1',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      await fs
        .rm('/media/startos/volumes/main/start9', { recursive: true })
        .catch(console.error)
    },
    down: IMPOSSIBLE,
  },
})
