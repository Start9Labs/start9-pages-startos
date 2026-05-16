import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_0_0_8 = VersionInfo.of({
  version: '1.0.0:8',
  releaseNotes: {
    en_US: 'Bumps start-sdk to 1.5.2.',
    es_ES: 'Actualiza start-sdk a 1.5.2.',
    de_DE: 'Aktualisiert start-sdk auf 1.5.2.',
    pl_PL: 'Aktualizuje start-sdk do 1.5.2.',
    fr_FR: 'Met à jour start-sdk vers 1.5.2.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
