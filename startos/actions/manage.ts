import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { z } from '@start9labs/start-sdk'
import { i18n } from '../i18n'

const { InputSpec, Value, List, Variants } = sdk

const pathPattern = {
  regex:
    '^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$',
  description: i18n('Must be a valid file path'),
}

const userPattern = {
  regex: "^(?! )(?!.* $)(?!\\.\\.?$)[a-zA-Z0-9 _.@'-]+$",
  description: i18n(
    "May only contain letters, digits, spaces and the characters _ . @ - ', with no space at the start or end.",
  ),
}

const folderLocation = (description: string, placeholder: string) =>
  Value.text({
    name: i18n('Folder Location'),
    required: true,
    default: null,
    description,
    placeholder,
    patterns: [pathPattern],
  })

const path = folderLocation(
  i18n(
    'The full path to the folder you want to host. If the folder contains an index.html or index.htm file, that web page will be served.',
  ),
  'e.g. websites/marketing-site',
)

export const inputSpec = InputSpec.of({
  pages: Value.list(
    List.obj(
      { name: i18n('Websites') },
      {
        displayAs: '{{name}}',
        uniqueBy: { all: ['port', 'name'] },
        spec: InputSpec.of({
          port: Value.hidden(z.number().nullable()),
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
            default: 'nextexplorer',
            description: i18n(
              "Where this website's files are stored. Start9 Pages serves them from there, read-only, and never copies them.\n- NextExplorer: a folder in one of its locations\n- Nextcloud: a folder in one Nextcloud user's files\n- FileBrowser Quantum: a folder in its file storage",
            ),
            variants: Variants.of({
              nextexplorer: {
                name: i18n('NextExplorer'),
                spec: InputSpec.of({
                  path: folderLocation(
                    i18n(
                      'The full path to the folder you want to host, starting with the location name (usually Files). If the folder contains an index.html or index.htm file, that web page will be served.',
                    ),
                    'e.g. Files/websites/marketing-site',
                  ),
                }),
              },
              nextcloud: {
                name: i18n('Nextcloud'),
                spec: InputSpec.of({
                  user: Value.text({
                    name: i18n('Nextcloud User'),
                    required: true,
                    default: 'admin',
                    description: i18n(
                      'The account name, not the display name, of the Nextcloud user whose files hold the website.',
                    ),
                    placeholder: 'e.g. admin',
                    patterns: [userPattern],
                  }),
                  path,
                }),
              },
              filebrowser: {
                name: i18n('FileBrowser Quantum'),
                spec: InputSpec.of({
                  path,
                }),
              },
            }),
          }),
          cors: Value.toggle({
            name: i18n('Allow CORS'),
            description: i18n(
              'Allow cross-origin requests from any domain. Required for use cases like Nostr NIP-05 verification. Leave off unless you know you need it.',
            ),
            default: false,
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
