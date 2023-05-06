import { ConfigSpec } from './spec'
import { ConfigSpecExtended, DomainConfigWithId, PageUnion, WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { v4 as uuid } from 'uuid'
import { Dependencies } from '@start9labs/start-sdk/lib/types'

const setDeps = (pageType: PageUnion, deps: Dependencies) => {
  if (pageType.unionSelectKey === 'web-page'){
    deps.push({
      id: pageType.unionValueKey.source,
      kind: 'exists'
    })
  }
}

export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
  const deps: Dependencies = []
  input.domains = input.domains.map((domain: DomainConfigWithId) => {
    if (!domain.id) domain.id = uuid()
    setDeps(domain.homepage, deps)
    if (domain.subdomains.length) {
      for (const subdomain of domain.subdomains) {
        setDeps(subdomain.settings, deps)
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