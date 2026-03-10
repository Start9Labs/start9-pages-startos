import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  pages: z.array(
    z.object({
      port: z.number().int().nonnegative(),
      name: z.string(),
      source: z.discriminatedUnion('selection', [
        z.object({
          selection: z.literal('nextcloud'),
          value: z.object({
            user: z.string(),
            path: z.string(),
          }),
        }),
        z.object({
          selection: z.literal('filebrowser'),
          value: z.object({
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
