import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const pages = (await storeJson.read((s) => s.pages).const(effects)) || []

  return Promise.all(
    pages.map(async (page) => {
      const { port, name } = page

      const multi = sdk.MultiHost.of(effects, String(port))
      const multiOrigin = await multi.bindPort(port, {
        protocol: 'http',
      })
      const multiInterface = sdk.createInterface(effects, {
        name,
        id: String(port),
        description: `The hosted website for ${name}`,
        type: 'ui',
        masked: false,
        schemeOverride: null,
        username: null,
        path: '',
        query: {},
      })

      return multiOrigin.export([multiInterface])
    }),
  )
})
