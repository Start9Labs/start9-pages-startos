import { ConfigSpec } from './spec'
import { ConfigSpecExtended, DomainConfigWithId, WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { v4 as uuid } from 'uuid'
import { Dependencies } from '@start9labs/start-sdk/lib/types'

export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
  const deps: Dependencies = []
  input.domains = input.domains.map((domain: DomainConfigWithId) => {
    if (!domain.id) domain.id = uuid()
    if (domain.homepage.unionSelectKey === 'web-page'){
      const domainValue = domain.homepage.unionValueKey
      if ('source' in domainValue) {
        deps.push({
          id: domainValue.source,
          kind: 'exists'
        })
      }
    }
    if (domain.subdomains.length) {
      for (const subdomain of domain.subdomains) {
        if (!subdomain.id) subdomain.id = uuid()
        const subdomainValue = subdomain.settings.unionValueKey
        if ('source' in subdomainValue) {
          deps.push({
            id: subdomainValue.source,
            kind: 'exists'
          })
        }
      }
    }
    return domain
  })
  await utils.setOwnWrapperData('/config', input as ConfigSpecExtended)
  return {
    dependenciesReceipt: await effects.setDependencies(deps),
    restart: true
  }
}