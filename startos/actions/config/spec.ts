import { randomUUID } from 'crypto'
import { sdk } from '../../sdk'
const { InputSpec, Value, List } = sdk

export const inputSpec = InputSpec.of({
  pages: Value.list(
    List.obj(
      {
        name: 'Pages',
      },
      {
        displayAs: '{{label}}',
        uniqueBy: 'label',
        spec: InputSpec.of({
          id: Value.text({
              name: 'ID',
              description: 'The ID of your page, used for internal persistence',
              required: {
                default: randomUUID(),
              },
          }),
          label: Value.text({
            name: 'Label',
            description:
              "The friendly name of this page (e.g. 'My Marketing Site')",
            placeholder: 'My website',
            required: {
              default: 'My website',
            },
          }),
          source: Value.select({
            name: 'Source',
            description: 'The service that contains your website files.',
            required: {
              default: null,
            },
            values: {
              filebrowser: 'filebrowser',
              nextcloud: 'nextcloud',
            },
          }),
          path: Value.text({
            name: 'Path',
            required: {
              default: null,
            },
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
    ),
  ),
})

export const matchConfigSpec = inputSpec.validator
export type ConfigSpec = typeof matchConfigSpec._TYPE
