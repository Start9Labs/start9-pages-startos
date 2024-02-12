import { types as T } from "../deps.ts";
import {
  matchSubdomains,
  matchWebPageHomepage,
  matchWebPageHomepageConfigOld,
  matchWebPageSubdomain,
  matchWebPageSubdomainOld,
} from "./types.ts";

export const convertHomepageConfigSource = (config: T.Config) => {
  if (matchWebPageHomepageConfigOld.test(config)) {
    switch (config.homepage.source) {
      case "nextcloud": {
        const newHomepage: typeof matchWebPageHomepage._TYPE = {
          type: config.homepage.type,
          source: {
            type: config.homepage.source,
            folder: config.homepage.folder,
            user: "embassy",
          },
        };
        return {
          ...config,
          homepage: newHomepage,
        };
      }
      case "filebrowser": {
        const newHomepage: typeof matchWebPageHomepage._TYPE = {
          type: config.homepage.type,
          source: {
            type: config.homepage.source,
            folder: config.homepage.folder!,
          },
        };
        return {
          ...config,
          homepage: newHomepage,
        };
      }
      default: {
        break;
      }
    }
  }
  return config;
};

export const convertSubdomainConfigSource = (config: T.Config) => {
  if (matchSubdomains.test(config)) {
    const newSubdomains = config.subdomains.map((sub) => {
      if (matchWebPageSubdomainOld.test(sub)) {
        switch (sub.settings.source) {
          case "nextcloud": {
            const newSubdomain: typeof matchWebPageSubdomain._TYPE = {
              name: sub.name,
              settings: {
                type: "web-page",
                source: {
                  type: sub.settings.source,
                  folder: sub.settings.folder,
                  // default username prior to nextcloud v26 when it was changed to admin
                  user: "embassy",
                },
              },
            };
            return newSubdomain;
          }
          case "filebrowser": {
            const newSubdomain: typeof matchWebPageSubdomain._TYPE = {
              name: sub.name,
              settings: {
                type: "web-page",
                source: {
                  type: sub.settings.source,
                  folder: sub.settings.folder,
                },
              },
            };
            return newSubdomain;
          }
          default: {
            break;
          }
        }
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
