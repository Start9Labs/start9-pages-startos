import { VersionInfo } from '@start9labs/start-sdk'

export const v_1_0_0_3 = VersionInfo.of({
  version: '1.0.0:3',
  releaseNotes: {
    en_US: 'Increase nginx server_names_hash limits for large site counts',
    es_ES:
      'Aumentar los límites de server_names_hash de nginx para grandes cantidades de sitios',
    de_DE:
      'Nginx server_names_hash-Limits für große Anzahl von Websites erhöht',
    pl_PL:
      'Zwiększenie limitów server_names_hash w nginx dla dużej liczby stron',
    fr_FR:
      'Augmentation des limites server_names_hash de nginx pour un grand nombre de sites',
  },
  migrations: {},
})
