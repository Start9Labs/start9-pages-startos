import { randomUUID } from 'crypto'
import { sdk } from '../../sdk'
import { inputSpec } from './spec'

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Configure',
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
    await sdk.store.setOwn(effects, sdk.StorePath.config, {
      pages: input.pages.map((p) => ({
        ...p,
        id: p.id || randomUUID(),
      })),
    })
  },
)
