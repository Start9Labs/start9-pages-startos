import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  pages: z.array(
    z.looseObject({
      port: z.number().int().nonnegative(),
      name: z.string(),
      cors: z.boolean().optional(),
      source: z.discriminatedUnion('selection', [
        z.looseObject({
          selection: z.literal('nextcloud'),
          value: z.looseObject({
            user: z.string(),
            path: z.string(),
          }),
        }),
        z.looseObject({
          selection: z.literal('filebrowser'),
          value: z.looseObject({
            path: z.string(),
          }),
        }),
        z.looseObject({
          selection: z.literal('nextexplorer'),
          value: z.looseObject({
            path: z.string(),
          }),
        }),
      ]),
    }),
  ),
})

export type StoreConfig = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
