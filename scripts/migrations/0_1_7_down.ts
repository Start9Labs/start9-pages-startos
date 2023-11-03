import { types as T } from "../deps.ts";
import {
  matchFilebrowserHomepage,
  matchFilebrowserSubdomain,
  matchSubdomains,
  matchWebPageHomepageConfigOld,
  matchWebPageSubdomainOld,
} from "./types.ts";

export const revertHomepageConfig = (config: T.Config) => {
  if (matchWebPageHomepageConfigOld.test(config)) {
    const newHomepage: typeof matchFilebrowserHomepage._TYPE = {
      type: "filebrowser",
      directory: config.homepage.folder,
    };
    delete config.homepage.source;
    delete config.homepage.folder;
    return {
      ...config,
      homepage: newHomepage
    };
  }
  return config;
};

export const revertSubdomainConfig = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    const newSubdomains = config.subdomains.map((sub) => {
      if (matchWebPageSubdomainOld.test(sub)) {
        const newSubdomain: typeof matchFilebrowserSubdomain._TYPE = {
          name: sub.name,
          settings: {
            type: "filebrowser",
            directory: sub.settings.folder,
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
