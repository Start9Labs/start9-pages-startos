import { sdk } from '../sdk'
import { shape, storeJson } from '../fileModels/store.json'

const { InputSpec, Value, List, Variants } = sdk

const path = Value.text({
  name: 'Folder Location',
  required: true,
  default: null,
  description:
    'The full path to the Filebrowser/Nextcloud folder that contains your website files. The folder must contain one of: index, index.html, or index.htm.',
  placeholder: 'e.g. websites/marketing-site',
  patterns: [
    {
      regex:
        '^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$',
      description: 'Must be a valid file path',
    },
  ],
})

export const inputSpec = InputSpec.of({
  pages: Value.list(
    List.obj(
      { name: 'Websites' },
      {
        displayAs: '{{name}}',
        uniqueBy: { all: ['port', 'name'] },
        spec: InputSpec.of({
          // @TODO Aiden how to type of number?
          port: Value.hidden<number>(),
          name: Value.text({
            name: 'Name',
            description:
              'A unique name to identify this website (e.g. "Marketing Site")',
            placeholder: 'My Website',
            required: true,
            default: null,
          }),
          source: Value.union({
            name: 'Source',
            default: 'filebrowser',
            description: 'The service that contains your website files',
            variants: Variants.of({
              nextcloud: {
                name: 'Nextcloud',
                spec: InputSpec.of({
                  user: Value.text({
                    name: 'Nextcloud User',
                    required: true,
                    default: 'admin',
                    description:
                      'The user account in Nextcloud where the website files are saved.',
                    placeholder: 'e.g. admin',
                    patterns: [
                      {
                        regex: '^[a-zA-Z0-9-.]+$',
                        description:
                          '"May only contain alphanumeric characters, hyphens, and periods.',
                      },
                    ],
                  }),
                  path,
                }),
              },
              filebrowser: {
                name: 'Filebrowser',
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
    name: 'Manage Websites',
    description: 'Add, edit, and remove websites',
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
    const usedPorts: number[] = []
    const pages: (typeof shape._TYPE)['pages'] = []

    input.pages.forEach((page) => {
      // @TODO Aiden validate path. Must be a directory that contains one of: index, index.html, index.htm
      const port = (page.port as number) || getPort(usedPorts)
      usedPorts.push(port)
      pages.push({ ...page, port })
    })

    await storeJson.write(effects, { pages })
  },
)

function getPort(usedPorts: number[]) {
  let port = 8000
  while (usedPorts.includes(port)) {
    port++
  }
  return port
}
