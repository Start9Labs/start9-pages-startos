import { PropertyString, PropertyGroup, setupProperties } from "start-sdk/lib/properties";
import { WrapperData } from '../wrapperData'

export const properties = setupProperties<WrapperData>(async ({ wrapperData }) => {
  const subdomains = PropertyGroup.of({
    name: 'Subdomains',
    description: 'The configured subdomains',
    value: wrapperData.subdomains.map(s =>
      PropertyString.of({
        name: 'Subdomain',
        description: `Link for the site ${s.name}`,
        value: `${s.name}.${wrapperData["tor-address"]}`,
        copyable: true,
        qr: true,
        masked: false,
      })
    )
  })
  return [subdomains]
})