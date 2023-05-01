import { types as T } from "../deps.ts";
import {
  matchFuckOffHomepageConfig,
} from "./types.ts";

export const convertHomepageVariants = (config: T.Config) => {
  if (matchFuckOffHomepageConfig.test(config)) {
    return {
      ...config,
      homepage: { ...config.homepage, type: "welcome" }
    };
  }
  return config;
};