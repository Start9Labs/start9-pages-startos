import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:16',
  releaseNotes: {
    en_US: `Link previews, such as LinkedIn's, now work for a website's home page and for any subfolder's index page.`,
    es_ES: `Las vistas previas de enlaces, como las de LinkedIn, ahora funcionan para la página de inicio de un sitio web y para la página índice de cualquier subcarpeta.`,
    de_DE: `Linkvorschauen, etwa die von LinkedIn, funktionieren jetzt für die Startseite einer Website und für die Indexseite jedes Unterordners.`,
    pl_PL: `Podglądy linków, takie jak w LinkedIn, działają teraz dla strony głównej witryny i dla strony indeksu każdego podfolderu.`,
    fr_FR: `Les aperçus de liens, comme ceux de LinkedIn, fonctionnent désormais pour la page d’accueil d’un site web et pour la page d’index de tout sous-dossier.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
