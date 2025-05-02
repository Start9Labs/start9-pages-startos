import { sdk } from './sdk'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const config = await sdk.store.getOwn(effects, sdk.StorePath.config).const()
  return Promise.all(
    config.pages.map(async (page) => {
      const { id, label, port } = page
      const multi = sdk.MultiHost.of(effects, id)
      const multiOrigin = await multi.bindPort(port, { protocol: 'http' })
      const multiInterface = sdk.createInterface(effects, {
        name: label,
        id,
        description: `The webpage for ${label}`,
        type: 'ui',
        masked: false,
        schemeOverride: null,
        username: null,
        path: '',
        search: {},
      })

      return multiOrigin.export([multiInterface])
    }),
  )
})
