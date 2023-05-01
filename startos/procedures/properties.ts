import { PropertyString, PropertyGroup, setupProperties } from "start-sdk/lib/properties";
import { WrapperData } from '../wrapperData'

export const properties = setupProperties<WrapperData>(async ({ wrapperData }) => {
  return wrapperData.config.domains.map(domain => {
    return PropertyGroup.of({
      name: `${domain.label}`,
      description: "The domain and/or subdomains of this page",
      value: domain.subdomains.length ?  [
        PropertyGroup.of({
        name: 'Subdomains',
        description: 'The subdomains available for this page',
        value: domain.subdomains.map(sub => {
          return PropertyString.of({
            name: `${sub.name}`,
            description: 'The URL of this subdomain',
            value: `${sub.name}.${}`, // TODO get this interface
            copyable: true,
            masked: false,
            qr: true
          })
        })
      })
      ] : [
        PropertyString.of({
          name: 'URL',
          description: 'The URL for this domain',
          value: "", // TODO get interface
          copyable: true,
          masked: false,
          qr: true
        })
      ],
    })
  })
})