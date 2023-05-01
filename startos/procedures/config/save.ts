import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from 'start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'

/**
 * This function executes on config save
 *
 * Use it to persist config data to various files and to establish any resulting dependencies
 */
export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
  await utils.setOwnWrapperData('/config', input)
  return effects.setDependencies([])
}


  // input.domains.map(domain => {
  //   if (domain.homepage) {
  //     switch (domain.homepage.type) {
  //       case 'index':
  //         if (domain.subdomains.length) {
  //           effects.runCommand()
  //         } else {

  //         }
    
  //         break;
  //       case 'web-page':
    
  //         break;
  //       case 'redirect':
    
  //         break;
      
  //       default:
  //         break;
  //     }
  //   }
  // })