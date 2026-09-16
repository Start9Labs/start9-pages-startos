import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:13',
  releaseNotes: {
    en_US: 'Websites can now be served from a NextExplorer folder.',
    es_ES:
      'Ahora los sitios web pueden servirse desde una carpeta de NextExplorer.',
    de_DE:
      'Websites können jetzt aus einem NextExplorer-Ordner bereitgestellt werden.',
    pl_PL:
      'Strony internetowe mogą być teraz serwowane z folderu NextExplorer.',
    fr_FR:
      'Les sites web peuvent désormais être servis depuis un dossier NextExplorer.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
