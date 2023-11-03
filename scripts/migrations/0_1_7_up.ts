import { types as T } from "../deps.ts";
import {
  matchFilebrowserHomepageConfig,
  matchFilebrowserSubdomain,
  matchSubdomains,
  matchWebPageHomepageOld,
  matchWebPageSubdomainOld,
} from "./types.ts";

export const convertHomepageConfig = (config: T.Config) => {
  if (matchFilebrowserHomepageConfig.test(config)) {
    const newHomepage: typeof matchWebPageHomepageOld._TYPE = {
      type: "web-page",
      source: "filebrowser",
      folder: config.homepage.directory!,
    };
    return {
      ...config,
      homepage: newHomepage
    };
  }
  return config;
};

export const convertSubdomainConfig = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    const newSubdomains = config.subdomains.map((sub) => {
      if (matchFilebrowserSubdomain.test(sub)) {
        const newSubdomain: typeof matchWebPageSubdomainOld._TYPE = {
          name: sub.name,
          settings: {
            type: "web-page",
            source: "filebrowser",
            folder: sub.settings.directory,
          },
        };
        return newSubdomain;
      }
      return sub;
    });
    return {
      ...config,
      subdomains: newSubdomains
    };
  }
  return config;
};
