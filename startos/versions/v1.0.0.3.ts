import { VersionInfo, IMPOSSIBLE } from "@start9labs/start-sdk"
export const v_1_0_0_3 = VersionInfo.of({
  version: "1.0.0:3",
  releaseNotes: { en_US: "Increased nginx server_names_hash limits to support large numbers of hosted sites" },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
