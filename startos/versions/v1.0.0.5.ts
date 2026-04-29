import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_0_0_5 = VersionInfo.of({
  version: '1.0.0:5',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.3.3)',
    es_ES: 'Actualizaciones internas (start-sdk 1.3.3)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.3.3)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.3.3)',
    fr_FR: 'Mises à jour internes (start-sdk 1.3.3)',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
