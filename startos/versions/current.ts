import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:14',
  releaseNotes: {
    en_US:
      'Byte-range requests now return partial responses for compressed file types, enabling media seeking and resumable downloads.',
    es_ES:
      'Las solicitudes de intervalos de bytes ahora devuelven respuestas parciales para los tipos de archivo comprimidos, lo que permite desplazarse por contenido multimedia y reanudar descargas.',
    de_DE:
      'Bytebereichsanfragen liefern jetzt Teilantworten für komprimierte Dateitypen, sodass Medien durchsucht und Downloads fortgesetzt werden können.',
    pl_PL:
      'Żądania zakresów bajtów zwracają teraz częściowe odpowiedzi dla kompresowanych typów plików, umożliwiając przewijanie multimediów i wznawianie pobierania.',
    fr_FR:
      'Les requêtes de plages d’octets renvoient désormais des réponses partielles pour les types de fichiers compressés, ce qui permet de parcourir les médias et de reprendre les téléchargements.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
