import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, arrayOf, string, natural, oneOf, literal } = matches

export const shape = object({
  pages: arrayOf(
    object({
      port: natural,
      name: string,
      source: oneOf(
        object({
          selection: literal('nextcloud'),
          value: object({
            user: string,
            path: string,
          }),
        }),
        object({
          selection: literal('filebrowser'),
          value: object({
            path: string,
          }),
        }),
      ),
    }),
  ),
})

export const storeJson = FileHelper.json(
  { volumeId: 'main', subpath: './store.json' },
  shape,
)
