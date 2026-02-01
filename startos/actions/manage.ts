import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { matches } from '@start9labs/start-sdk'
import { i18n } from '../i18n'

const { InputSpec, Value, List, Variants } = sdk

const path = Value.text({
  name: i18n('Folder Location'),
  required: true,
  default: null,
  description: i18n(
    'The full path to the Filebrowser/Nextcloud folder you want to host. If the folder contains one of: index, index.html, or index.htm files, that web page will be served.',
  ),
  placeholder: 'e.g. websites/marketing-site',
  patterns: [
    {
      regex:
        '^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$',
      description: i18n('Must be a valid file path'),
    },
  ],
})

export const inputSpec = InputSpec.of({
  pages: Value.list(
    List.obj(
      { name: i18n('Websites') },
      {
        displayAs: '{{name}}',
        uniqueBy: { all: ['port', 'name'] },
        spec: InputSpec.of({
          port: Value.hidden(matches.number.nullable()),
          name: Value.text({
            name: i18n('Name'),
            description: i18n(
              'A unique name to identify this website (e.g. "Marketing Site")',
            ),
            placeholder: 'My Website',
            required: true,
            default: null,
          }),
          source: Value.union({
            name: i18n('Source'),
            default: 'filebrowser',
            description: i18n('The service that contains your website files'),
            variants: Variants.of({
              nextcloud: {
                name: i18n('Nextcloud'),
                spec: InputSpec.of({
                  user: Value.text({
                    name: i18n('Nextcloud User'),
                    required: true,
                    default: 'admin',
                    description: i18n(
                      'The user account in Nextcloud where the website files are saved.',
                    ),
                    placeholder: 'e.g. admin',
                    patterns: [
                      {
                        regex: '^[a-zA-Z0-9-.]+$',
                        description: i18n(
                          'May only contain alphanumeric characters, hyphens, and periods.',
                        ),
                      },
                    ],
                  }),
                  path,
                }),
              },
              filebrowser: {
                name: i18n('Filebrowser'),
                spec: InputSpec.of({
                  path,
                }),
              },
            }),
          }),
        }),
      },
    ),
  ),
})

export const manage = sdk.Action.withInput(
  // id
  'manage',

  // metadata
  async ({ effects }) => ({
    name: i18n('Manage Websites'),
    description: i18n('Add, edit, and remove websites'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => ({
    pages: (await storeJson.read((s) => s.pages).once()) || [],
  }),

  // the execution function
  async ({ effects, input }) => {
    const usedPorts = new Set(
      input.pages.filter((p) => !!p.port).map((p) => p.port as number),
    )

    const pages = input.pages.map((page) => {
      // @TODO Aiden validate path. Must be a directory
      const port = page.port || getPort(usedPorts)
      usedPorts.add(port)
      return { ...page, port }
    })

    await storeJson.write(effects, { pages })
  },
)

export function getPort(usedPorts: Set<number>) {
  let port = 8000
  while (usedPorts.has(port)) {
    port++
  }
  return port
}
