import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:19',
  releaseNotes: {
    en_US: `- Browsers check for updated pages on every visit and for other site files after an hour, so changes to a site show up promptly.`,
    es_ES: `- Los navegadores comprueban si hay páginas actualizadas en cada visita y el resto de archivos del sitio al cabo de una hora, por lo que los cambios en un sitio se ven enseguida.`,
    de_DE: `- Browser prüfen bei jedem Besuch auf aktualisierte Seiten und bei anderen Dateien der Website nach einer Stunde, sodass Änderungen an einer Website schnell sichtbar werden.`,
    pl_PL: `- Przeglądarki sprawdzają aktualizacje stron przy każdej wizycie, a pozostałych plików witryny po godzinie, więc zmiany w witrynie są widoczne szybko.`,
    fr_FR: `- Les navigateurs vérifient les pages mises à jour à chaque visite et les autres fichiers du site au bout d’une heure, pour que les modifications d’un site apparaissent rapidement.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
