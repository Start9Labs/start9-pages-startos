import { compat, types as T } from "../deps.ts";
import { matchSubdomains, matchWebPageHomepageConfig, matchWebPageSubdomain } from "../migrations/types.ts";
export const setConfig: T.ExpectedExports.setConfig = async (
  effects,
  config,
) => {
  let depFilebrowser: T.DependsOn = {}
  let depNextcloud: T.DependsOn = {}

  if (matchWebPageHomepageConfig.test(config)) {
    switch (config.homepage.source.type) {
      case 'filebrowser': {
        depFilebrowser =  { filebrowser: [] }
        break;
      }
      case 'nextcloud': {
        depNextcloud =  { nextcloud: [] }
        const path = `/data/${config.homepage.source.user}/files/${config.homepage.source.folder}`
        config.homepage.source.folder = path
        break;
      }
      default: {
        break;
      }
    }
  }

  if (matchSubdomains.test(config)) {
    config.subdomains.map(sub => {
      if (matchWebPageSubdomain.test(sub)) {
        switch (sub.settings.source.type) {
          case 'filebrowser':{
            depFilebrowser =  { filebrowser: [] }
            break;
          }
          case 'nextcloud': {
            depNextcloud =  { nextcloud: [] }
            const path = `/data/${sub.settings.source.user}/files/${sub.settings.source.folder}`
            sub.settings.source.folder = path
            break;
          }
          default:{
            break;
          }
        }
      }
    })
  }

  return await compat.setConfig(effects, config, {
    ...depFilebrowser,
    ...depNextcloud
  });
};
