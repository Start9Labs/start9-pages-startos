import { sdk } from '../sdk'
import { configSpec } from './config/spec'

export const uiPort = 80

export const setInterfaces = sdk.setupInterfaces(
  configSpec,
  async ({ effects, utils, input }) => {
    return Promise.all(
      (input?.pages || []).map(async (page) => {
        const { id, label } = page
        const multi = utils.host.multi(id!) // technically just a multi hostname
        const multiOrigin = await multi.bindPort(uiPort, { protocol: 'http' })
        const multiInterface = utils.createInterface({
          name: label,
          id: id!,
          description: `The webpage for ${label}`,
          ui: true,
          username: null,
          path: '',
          search: {},
        })

        return multiInterface.export([multiOrigin])
      }),
    )
  },
)
