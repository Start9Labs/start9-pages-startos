import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import * as fs from 'fs/promises'

export const v0_2_0_1 = VersionInfo.of({
  version: '0.2.0:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      await fs
        .rm('/media/startos/volumes/main/start9', { recursive: true })
        .catch(console.error)
    },
    down: IMPOSSIBLE,
  },
})
