import { compat, types as T } from "../deps.ts";
import { matchSubdomains, matchWebPageHomepage, matchWebPageSubdomain } from "../migrations/types.ts";
export const setConfig: T.ExpectedExports.setConfig = async (
  effects,
  config,
) => {
  let depFilebrowser: T.DependsOn = {}
  let depGitea: T.DependsOn = {}
  let depNextcloud: T.DependsOn = {}

  if (matchWebPageHomepage.test(config)) {
    switch (config.homepage.source) {
      case 'filebrowser':
        depFilebrowser =  { filebrowser: [] }
        break;
      case 'gitea':
        depGitea =  { gitea: [] }
        break;
      case 'nextcloud':
        depNextcloud =  { nextcloud: [] }
        break;
      default:
        break;
    }
  }

  if (matchSubdomains.test(config)) {
    config.subdomains.map(sub => {
      if (matchWebPageSubdomain.test(sub)) {
        switch (sub.settings.source) {
          case 'filebrowser':
            depFilebrowser =  { filebrowser: [] }
            break;
          case 'gitea':
            depGitea =  { gitea: [] }
            break;
          case 'nextcloud':
            depNextcloud =  { nextcloud: [] }
            break;
          default:
            break;
        }
      }
    })
  }

  return await compat.setConfig(effects, config, {
    ...depFilebrowser,
    ...depGitea,
    ...depNextcloud
  });
};
