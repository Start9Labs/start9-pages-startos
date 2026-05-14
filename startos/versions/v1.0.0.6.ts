import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_0_0_6 = VersionInfo.of({
  version: '1.0.0:6',
  releaseNotes: {
    en_US: `**Internal**

- Bump start-sdk to 1.5.1`,
    es_ES: `**Internas**

- Actualización de start-sdk a 1.5.1`,
    de_DE: `**Intern**

- start-sdk auf 1.5.1 aktualisiert`,
    pl_PL: `**Wewnętrzne**

- Aktualizacja start-sdk do 1.5.1`,
    fr_FR: `**Internes**

- Mise à jour de start-sdk vers 1.5.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
