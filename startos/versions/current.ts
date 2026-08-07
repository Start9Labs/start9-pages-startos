import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:12',
  releaseNotes: {
    en_US:
      'Fixed broken redirects for directory URLs without a trailing slash. Websites can now provide their own 404.html error page.',
    es_ES:
      'Corregidas las redirecciones rotas para URLs de directorio sin barra final. Los sitios web ahora pueden proporcionar su propia página de error 404.html.',
    de_DE:
      'Fehlerhafte Weiterleitungen für Verzeichnis-URLs ohne abschließenden Schrägstrich behoben. Websites können jetzt ihre eigene 404.html-Fehlerseite bereitstellen.',
    pl_PL:
      'Naprawiono nieprawidłowe przekierowania adresów URL katalogów bez ukośnika na końcu. Strony internetowe mogą teraz udostępniać własną stronę błędu 404.html.',
    fr_FR:
      "Correction des redirections défectueuses pour les URL de répertoire sans barre oblique finale. Les sites web peuvent désormais fournir leur propre page d'erreur 404.html.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
