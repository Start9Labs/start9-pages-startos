import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.0:3',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.2 or later. Each website now has its own health check that says what is wrong and how to fix it: its source service isn't installed, a Nextcloud account or folder doesn't exist (listing the ones that do), the folder is empty, or its index.html is missing or in a subfolder. A site whose source service isn't installed no longer stops the other sites from being served. In Manage Websites, a source that isn't installed is marked as such, and the first installed source is preselected.",
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Cada sitio web tiene ahora su propia comprobación de estado, que indica qué falla y cómo solucionarlo: su servicio de origen no está instalado, no existe una cuenta o carpeta de Nextcloud (con la lista de las que sí existen), la carpeta está vacía, o su index.html falta o está en una subcarpeta. Un sitio cuyo servicio de origen no está instalado ya no impide servir los demás sitios. En Administrar sitios web, una fuente no instalada se marca como tal y se preselecciona la primera fuente instalada.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. Jede Website hat jetzt eine eigene Statusprüfung, die sagt, was nicht stimmt und wie es sich beheben lässt: Ihr Quelldienst ist nicht installiert, ein Nextcloud-Konto oder Ordner existiert nicht (mit einer Liste der vorhandenen), der Ordner ist leer, oder ihre index.html fehlt oder liegt in einem Unterordner. Eine Website, deren Quelldienst nicht installiert ist, verhindert nicht mehr, dass die anderen Websites ausgeliefert werden. Unter Websites verwalten wird eine nicht installierte Quelle als solche gekennzeichnet und die erste installierte Quelle vorausgewählt.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Każda strona ma teraz własne sprawdzenie stanu, które mówi, co jest nie tak i jak to naprawić: jej usługa źródłowa nie jest zainstalowana, konto lub folder Nextcloud nie istnieje (z listą istniejących), folder jest pusty albo brakuje pliku index.html lub znajduje się on w podfolderze. Strona, której usługa źródłowa nie jest zainstalowana, nie blokuje już serwowania pozostałych stron. W Zarządzaj stronami niezainstalowane źródło jest oznaczone jako takie, a pierwsze zainstalowane źródło jest wybrane domyślnie.',
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Chaque site web a désormais son propre contrôle d'état, qui indique ce qui ne va pas et comment le corriger : son service source n'est pas installé, un compte ou un dossier Nextcloud n'existe pas (avec la liste de ceux qui existent), le dossier est vide, ou son index.html manque ou se trouve dans un sous-dossier. Un site dont le service source n'est pas installé n'empêche plus les autres sites d'être servis. Dans Gérer les sites web, une source non installée est signalée comme telle et la première source installée est présélectionnée.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
