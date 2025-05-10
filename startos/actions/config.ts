import { sdk } from '../sdk'
import { createPortGenerator, getLowercaseAlphaString } from '../utils'
import { store } from '../file-models/store.json'

const { InputSpec, Value, List, Variants } = sdk

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
          source: Value.union(
            {
              name: 'Source',
              default: 'nextcloud',
              description: 'The service that contains your website files.',
            },
            Variants.of({
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
                  path: Value.text({
                    name: 'Path',
                    required: true,
                    default: null,
                    description:
                      'The path to the folder that contains the static files of your website. For example, a value of "projects/resume" would tell Embassy Pages to look for that folder path in the selected service.',
                    placeholder: 'e.g. websites/resume',
                    patterns: [
                      {
                        regex:
                          '^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$',
                        description: 'Must be a valid relative file path',
                      },
                    ],
                  }),
                }),
              },
              filebrowser: {
                name: 'Filebrowser',
                spec: InputSpec.of({
                  path: Value.text({
                    name: 'Path',
                    required: true,
                    default: null,
                    description:
                      'The path to the folder that contains the static files of your website. For example, a value of "projects/resume" would tell Start9 Pages to look for that folder path in the selected service.',
                    placeholder: 'e.g. websites/resume',
                    patterns: [
                      {
                        regex:
                          '^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$',
                        description: 'Must be a valid relative file path',
                      },
                    ],
                  }),
                }),
              },
            }),
          ),
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
          id: p.id || getLowercaseAlphaString(),
          port: p.port || newPort,
        }
      }),
    })
  },
)
