import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { i18n } from './i18n'

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
        description: i18n('The hosted website for ${name}', { name }),
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
