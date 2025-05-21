import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, arrayOf, string, natural, oneOf, literal } = matches

const shape = object({
  pages: arrayOf(
    object({
      id: string,
      port: natural,
      label: string,
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
  ports: arrayOf(natural),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
