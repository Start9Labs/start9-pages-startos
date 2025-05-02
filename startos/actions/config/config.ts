import { sdk } from '../../sdk'
import { inputSpec } from './spec'
import { createPortGenerator, getLowercaseAlphaString } from '../../utils'

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Settings',
    description: 'Add and manage your pages',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  ({ effects }) => sdk.store.getOwn(effects, sdk.StorePath.config).const(),

  // the execution function
  async ({ effects, input }) => {
    const usedPortsRaw = await sdk.store
      .getOwn(effects, sdk.StorePath.ports)
      .once()
    const usedPorts = new Set(usedPortsRaw || [])

    await sdk.store.setOwn(effects, sdk.StorePath.config, {
      pages: input.pages.map((p) => {
        const newPort = createPortGenerator(usedPorts)
        usedPorts.add(newPort)
        return {
          ...p,
          id: p.id || getLowercaseAlphaString(),
          port: p.port || newPort,
        }
      }),
    })
    await sdk.store.setOwn(effects, sdk.StorePath.ports, [...usedPorts])
  },
)
