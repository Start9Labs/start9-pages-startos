import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:12',
  releaseNotes: {
    en_US: 'Fixed broken redirects for directory URLs without a trailing slash',
    es_ES:
      'Corregidas las redirecciones rotas para URLs de directorio sin barra final',
    de_DE:
      'Fehlerhafte Weiterleitungen für Verzeichnis-URLs ohne abschließenden Schrägstrich behoben',
    pl_PL:
      'Naprawiono nieprawidłowe przekierowania adresów URL katalogów bez ukośnika na końcu',
    fr_FR:
      'Correction des redirections défectueuses pour les URL de répertoire sans barre oblique finale',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
