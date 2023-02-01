import { types as T } from "../deps.ts";
import {
  matchFilebrowserHomepage,
  matchFilebrowserSubdomain,
  matchSubdomains,
  matchWebPageHomepage,
  matchWebPageSubdomain,
} from "./types.ts";

export const revertHomepageConfig = (config: T.Config) => {
  if (matchWebPageHomepage.test(config)) {
    const newConfig: typeof matchFilebrowserHomepage._TYPE = {
      homepage: {
        type: "filebrowser",
        directory: config.homepage.folder,
      },
    };
    delete config.homepage.source;
    return { ...config, ...newConfig };
  }
  return config;
};

export const revertSubdomainConfig = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    config.subdomains.map((sub) => {
      if (matchWebPageSubdomain.test(sub)) {
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
    return config;
  }
  return config;
};
