import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_0_0_6 = VersionInfo.of({
  version: '1.0.0:6',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.5.1)',
    es_ES: 'Actualizaciones internas (start-sdk 1.5.1)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.5.1)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.5.1)',
    fr_FR: 'Mises à jour internes (start-sdk 1.5.1)',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
