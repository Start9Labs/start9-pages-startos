import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import i18n from '../../manifest/i18n'

export const v1_0_0_1_b0 = VersionInfo.of({
  version: '1.0.0:1-beta.0',
  releaseNotes: i18n.releaseNotes.v1_0_0_1_a0,
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
