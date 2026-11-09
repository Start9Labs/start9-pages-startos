import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.0:1',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.1 or later. Start9 Pages now sees only Nextcloud's user files, not its configuration.",
    es_ES:
      'Requiere StartOS 0.4.1 o posterior. Start9 Pages ahora solo ve los archivos de usuario de Nextcloud, no su configuración.',
    de_DE:
      'Erfordert StartOS 0.4.1 oder neuer. Start9 Pages sieht jetzt nur noch die Benutzerdateien von Nextcloud, nicht dessen Konfiguration.',
    pl_PL:
      'Wymaga StartOS 0.4.1 lub nowszego. Start9 Pages widzi teraz tylko pliki użytkowników Nextcloud, a nie jego konfigurację.',
    fr_FR:
      'Nécessite StartOS 0.4.1 ou une version ultérieure. Start9 Pages ne voit désormais que les fichiers utilisateur de Nextcloud, et non sa configuration.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
