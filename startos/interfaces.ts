import { sdk } from './sdk'

export const uiPort = 80

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const config = await sdk.store.getOwn(effects, sdk.StorePath.config).const()
    if (!config || !config.pages)
      await sdk.store.setOwn(effects, sdk.StorePath, { config: { pages: [] } })

  return Promise.all(
    (config.pages || []).map(async (page) => {
      const { id, label } = page
      const multi = sdk.MultiHost.of(effects, id)
      const multiOrigin = await multi.bindPort(uiPort, { protocol: 'http' })
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
