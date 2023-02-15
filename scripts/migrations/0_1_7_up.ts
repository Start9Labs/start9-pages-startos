import { types as T } from "../deps.ts";
import {
  matchFilebrowserHomepageConfig,
  matchFilebrowserSubdomain,
  matchSubdomains,
  matchWebPageHomepage,
  matchWebPageHomepageConfig,
  matchWebPageSubdomain,
} from "./types.ts";

export const convertHomepageConfig = (config: T.Config) => {
  if (matchFilebrowserHomepageConfig.test(config)) {
    const newHomepage: typeof matchWebPageHomepage._TYPE = {
      type: "web-page",
      source: "filebrowser",
      folder: config.homepage.directory!,
    };
    (config as typeof matchWebPageHomepageConfig._TYPE).homepage = newHomepage;
    return config;
  }
  return config;
};

export const convertSubdomainConfig = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    const newSubdomains = config.subdomains.map((sub) => {
      if (matchFilebrowserSubdomain.test(sub)) {
        const newSubdomain: typeof matchWebPageSubdomain._TYPE = {
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
    config.subdomains = newSubdomains;
    return config;
  }
  return config;
};
