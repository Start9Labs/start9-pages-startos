import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:17',
  releaseNotes: {
    en_US: `Websites now load from folders with spaces in their names.

The Nextcloud User field now accepts any account name Nextcloud allows, including ones with spaces, underscores, @ or apostrophes.`,
    es_ES: `Los sitios web ahora se cargan desde carpetas con espacios en su nombre.

El campo Usuario de Nextcloud ahora acepta cualquier nombre de cuenta que Nextcloud permita, incluidos los que contienen espacios, guiones bajos, @ o apóstrofos.`,
    de_DE: `Websites laden jetzt auch aus Ordnern, deren Namen Leerzeichen enthalten.

Das Feld Nextcloud-Benutzer akzeptiert jetzt jeden Kontonamen, den Nextcloud erlaubt, auch solche mit Leerzeichen, Unterstrichen, @ oder Apostrophen.`,
    pl_PL: `Witryny wczytują się teraz z folderów, których nazwy zawierają spacje.

Pole Użytkownik Nextcloud akceptuje teraz każdą nazwę konta dozwoloną przez Nextcloud, w tym nazwy ze spacjami, podkreślnikami, @ lub apostrofami.`,
    fr_FR: `Les sites web se chargent désormais depuis des dossiers dont le nom contient des espaces.

Le champ Utilisateur Nextcloud accepte désormais tout nom de compte autorisé par Nextcloud, y compris ceux contenant des espaces, des tirets bas, @ ou des apostrophes.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
