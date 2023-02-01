import { types as T } from "../deps.ts";
import {
  matchFilebrowserHomepage,
  matchFilebrowserSubdomain,
  matchSubdomains,
  matchWebPageHomepage,
  matchWebPageSubdomain,
} from "./types.ts";

export const convertHomepageConfig = (config: T.Config) => {
  if (matchFilebrowserHomepage.test(config)) {
    const newConfig: typeof matchWebPageHomepage._TYPE = {
      homepage: {
        type: "web-page",
        source: "filebrowser",
        folder: config.homepage.directory!,
      },
    };
    delete config.homepage.directory;
    return { ...config, ...newConfig };
  }
  return config;
};

export const convertSubdomainConfig = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    config.subdomains.map((sub) => {
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
    return config;
  }
  return config;
};
