import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_0_0_7 = VersionInfo.of({
  version: '1.0.0:7',
  releaseNotes: {
    en_US: 'Updates user-facing instructions.',
    es_ES: 'Actualiza las instrucciones para el usuario.',
    de_DE: 'Aktualisiert die Benutzeranweisungen.',
    pl_PL: 'Aktualizuje instrukcje dla użytkownika.',
    fr_FR: 'Met à jour les instructions destinées à l’utilisateur.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
