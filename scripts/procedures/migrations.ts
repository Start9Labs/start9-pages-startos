import { compat, types as T } from "../deps.ts";
import { convertHomepageVariants } from "../migrations/0_1_7_1_up.ts";
import {
  revertHomepageConfig,
  revertSubdomainConfig,
} from "../migrations/0_1_7_down.ts";
import {
  convertHomepageConfig,
  convertSubdomainConfig,
} from "../migrations/0_1_7_up.ts";

export const migration: T.ExpectedExports.migration = async (
  effects,
  version,
  ...args
) => {
  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });
  return compat.migrations
    .fromMapping(
      {
        "0.1.7": {
          up: compat.migrations.updateConfig(
            (config) => {
              if (Object.keys(config).length === 0) {
                // service was never configured
                return config;
              }
              return convertSubdomainConfig(convertHomepageConfig(config));
            },
            true,
            { version: "0.1.7", type: "up" },
          ),
          down: compat.migrations.updateConfig(
            (config) => {
              return revertSubdomainConfig(revertHomepageConfig(config));
            },
            true,
            { version: "0.1.7", type: "down" },
          ),
        },
        "0.1.7.1": {
          up: compat.migrations.updateConfig(
            (config) => {
              if (Object.keys(config).length === 0) {
                // service was never configured
                return config;
              }
              return convertHomepageVariants(config);
            },
            true,
            { version: "0.1.7.1", type: "up" },
          ),
          down: compat.migrations.updateConfig(
            (config) => config,
            true,
            { version: "0.1.7.1", type: "down" },
          ),
        },
      },
      "0.1.7.3",
    )(effects, version, ...args);
};
