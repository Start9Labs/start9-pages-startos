import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_0_0_1_a0 = VersionInfo.of({
  version: '1.0.0:1-alpha.0',
  releaseNotes: 'Initial release for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
