import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:16',
  releaseNotes: {
    en_US: `Link previews, such as LinkedIn's, now work for a website's home page and for any subfolder's index page.

A page saved as about.html now also loads at /about. If a website has both about.html and an about folder, /about serves about.html.`,
    es_ES: `Las vistas previas de enlaces, como las de LinkedIn, ahora funcionan para la página de inicio de un sitio web y para la página índice de cualquier subcarpeta.

Una página guardada como about.html ahora también se carga en /about. Si un sitio web tiene about.html y una carpeta about, /about muestra about.html.`,
    de_DE: `Linkvorschauen, etwa die von LinkedIn, funktionieren jetzt für die Startseite einer Website und für die Indexseite jedes Unterordners.

Eine als about.html gespeicherte Seite lädt jetzt auch unter /about. Hat eine Website sowohl about.html als auch einen Ordner about, liefert /about die Datei about.html.`,
    pl_PL: `Podglądy linków, takie jak w LinkedIn, działają teraz dla strony głównej witryny i dla strony indeksu każdego podfolderu.

Strona zapisana jako about.html ładuje się teraz także pod adresem /about. Jeśli witryna ma zarówno about.html, jak i folder about, pod /about wyświetlana jest strona about.html.`,
    fr_FR: `Les aperçus de liens, comme ceux de LinkedIn, fonctionnent désormais pour la page d’accueil d’un site web et pour la page d’index de tout sous-dossier.

Une page enregistrée sous about.html se charge désormais aussi à l’adresse /about. Si un site web contient à la fois about.html et un dossier about, /about affiche about.html.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
