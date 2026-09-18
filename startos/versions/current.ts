import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:15',
  releaseNotes: {
    en_US: `NextExplorer, now published on the Start9 Registry, is the default source for a new website. Existing websites are unchanged.

Byte-range requests now return partial responses for compressed file types, enabling media seeking and resumable downloads.`,
    es_ES: `NextExplorer, ahora publicado en el Registro de Start9, es el origen predeterminado para un sitio web nuevo. Los sitios web existentes no cambian.

Las solicitudes de intervalos de bytes ahora devuelven respuestas parciales para los tipos de archivo comprimidos, lo que permite desplazarse por contenido multimedia y reanudar descargas.`,
    de_DE: `NextExplorer, jetzt in der Start9-Registry veröffentlicht, ist die Standardquelle für eine neue Website. Bestehende Websites bleiben unverändert.

Bytebereichsanfragen liefern jetzt Teilantworten für komprimierte Dateitypen, sodass Medien durchsucht und Downloads fortgesetzt werden können.`,
    pl_PL: `NextExplorer, publikowany teraz w rejestrze Start9, jest domyślnym źródłem nowej strony internetowej. Istniejące strony pozostają bez zmian.

Żądania zakresów bajtów zwracają teraz częściowe odpowiedzi dla kompresowanych typów plików, umożliwiając przewijanie multimediów i wznawianie pobierania.`,
    fr_FR: `NextExplorer, désormais publié sur le registre Start9, est la source par défaut d’un nouveau site web. Les sites existants ne changent pas.

Les requêtes de plages d’octets renvoient désormais des réponses partielles pour les types de fichiers compressés, ce qui permet de parcourir les médias et de reprendre les téléchargements.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
