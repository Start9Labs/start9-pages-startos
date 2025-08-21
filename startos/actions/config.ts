import { sdk } from '../sdk'
import { createPortGenerator, getLowercaseAlphaString } from '../utils'
import { store } from '../fileModels/store.json'

const { InputSpec, Value, List, Variants } = sdk

const path = Value.text({
  name: 'Path to website folder',
  required: true,
  default: null,
  description:
    'The path to the folder that contains your website. The folder must contain one of these files: index index.html index.htm. For example, if the root of your source service has a folder called websites, the path "websites/resume" would tell Start9 Pages to look for the website files at that path.',
  placeholder: 'e.g. websites/resume',
  patterns: [
    {
      regex:
        '^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$',
      description: 'Must be a valid relative file path, *not* a specific file name',
    },
  ],
})

export const inputSpec = InputSpec.of({
  pages: Value.list(
    List.obj(
      { name: 'Pages' },
      {
        displayAs: '{{label}}',
        uniqueBy: 'label',
        spec: InputSpec.of({
          id: Value.hidden(),
          port: Value.hidden(),
          label: Value.text({
            name: 'Label',
            description:
              "The friendly name of this page (e.g. 'My Marketing Site')",
            placeholder: 'My website',
            required: true,
            default: 'My website',
          }),
          source: Value.union({
            name: 'Source',
            default: 'filebrowser',
            description: 'The service that contains your website files.',
            variants: Variants.of({
              nextcloud: {
                name: 'Nextcloud',
                spec: InputSpec.of({
                  user: Value.text({
                    name: 'User',
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
  async ({ effects }) => ({
    pages: (await store.read((s) => s.pages).once()) || [],
  }),

  // the execution function
  async ({ effects, input }) => {
    const usedPortsRaw = (await store.read((s) => s.ports).once()) || []
    const usedPorts = new Set(usedPortsRaw)

    await store.merge(effects, {
      ports: [...usedPorts],
      pages: input.pages.map((p) => {
        const newPort = createPortGenerator(usedPorts)
        usedPorts.add(newPort)
        return {
          ...p,
          id: (p.id as string) || getLowercaseAlphaString(),
          port: (p.port as number) || newPort,
        }
      }),
    })
  },
)

// instructions with examples
// update descriptions
// input validation - looks like a path - no proceeding slash for uniformity
// js validation on validity of the path - directory + contains any of index index.html index.htm
