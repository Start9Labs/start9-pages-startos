import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import i18n from '../../manifest/i18n'

export const v_1_0_0_2_b3 = VersionInfo.of({
  version: '1.0.0:2-beta.3',
  releaseNotes: i18n.releaseNotes.v1_0_0_1_a0,
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
