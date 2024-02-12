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
    // deno-lint-ignore no-explicit-any
    delete (config.homepage as any).source;
    // deno-lint-ignore no-explicit-any
    delete (config.homepage as any).folder;
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
