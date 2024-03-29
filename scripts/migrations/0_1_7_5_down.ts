import { types as T } from "../deps.ts";
import {
  matchSubdomains,
  matchWebPageHomepageConfig,
  matchWebPageHomepageOld,
  matchWebPageSubdomain,
  matchWebPageSubdomainOld,
} from "./types.ts";

export const revertHomepageConfigSource = (config: T.Config) => {
  if (matchWebPageHomepageConfig.test(config)) {
    const newHomepage: typeof matchWebPageHomepageOld._TYPE = {
      type: config.homepage.type,
      source: config.homepage.source.type,
      folder: config.homepage.source.folder,
    };
    return {
      ...config,
      homepage: newHomepage,
    };
  }
  return config;
};

export const revertSubdomainConfigSource = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    const newSubdomains = config.subdomains.map((sub) => {
      if (matchWebPageSubdomain.test(sub)) {
        const newSubdomain: typeof matchWebPageSubdomainOld._TYPE = {
          name: sub.name,
          settings: {
            type: "web-page",
            source: sub.settings.source.type,
            folder: sub.settings.source.folder,
          },
        };
        return newSubdomain;
      }
      return sub;
    });
    return {
      ...config,
      subdomains: newSubdomains,
    };
  }
  return config;
};
