import { types as T, compat } from '../deps.ts'

export const migration: T.ExpectedExports.migration = async (effects, version, ...args) => {
  await effects.createDir({
    path: "start9",
    volumeId: "main"
  });
  return compat.migrations
    .fromMapping(
      {},
      "0.1.4",
    )(effects, version, ...args)
}