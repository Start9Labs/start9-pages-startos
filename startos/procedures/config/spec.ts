import { Config, List, Value, Variants } from "start-sdk/lib/config/builder";

export const configSpec = Config.of({
  domains: Value.list(List.obj({
    name: "Domains",
    description: "The domains for each page",
  }, {
    displayAs: "{{label}}",
    uniqueBy: "label",
    spec: Config.of({
      label: Value.text({
        name: "Label",
        description:
          "The friendly name of this domain (e.g. 'My Marketing Site')",
        placeholder: "My website",
        required: {
          default: "My website",
        },
      }),
      homepage: Value.union(
        {
          name: "Homepage",
          description:
            "The page that will be displayed when your Start9 Pages .onion address is visited. Since this page is technically publicly accessible, you can choose to which type of page to display.",
          required: {
            default: "welcome",
          },
        },
        Variants.of({
          welcome: { name: "Welcome", spec: Config.of({}) },
          index: { name: "Table of Contents", spec: Config.of({}) },
          "web-page": {
            name: "Web Page",
            spec: Config.of({
              source: Value.select(
                {
                  name: "Folder Location",
                  description: "The service that contains your website files.",
                  warning: null,
                  required: {
                    default: "nextcloud",
                  },
                  values: {
                    filebrowser: "filebrowser",
                    nextcloud: "nextcloud",
                  },
                } as const,
              ),
              folder: Value.text({
                name: "Folder Path",
                required: {
                  default: null,
                },
                description:
                  'The path to the folder that contains the static files of your website. For example, a value of "projects/resume" would tell Embassy Pages to look for that folder path in the selected service.',
                warning: null,
                masked: false,
                placeholder: "e.g. websites/resume",
                inputmode: "text",
                patterns: [
                  {
                    regex:
                      "^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$",
                    description: "Must be a valid relative file path",
                  },
                ],
                minLength: null,
                maxLength: null,
              }),
            }),
          },
          redirect: {
            name: "Redirect",
            spec: Config.of({
              target: Value.text({
                name: "Target Subdomain",
                required: {
                  default: null,
                },
                description:
                  "The name of the subdomain to redirect users to. This must be a valid subdomain site within your Embassy Pages.",
                warning: null,
                masked: false,
                placeholder: null,
                inputmode: "text",
                patterns: [
                  {
                    regex: "^[a-z-]+$",
                    description:
                      "May contain only lowercase characters and hyphens.",
                  },
                ],
                minLength: null,
                maxLength: null,
              }),
            }),
          },
        }),
      ),
      subdomains: Value.list(
        List.obj(
          {
            name: "Subdomains",
            minLength: null,
            maxLength: null,
            default: [],
            description: "The websites you want to serve.",
            warning: null,
          },
          {
            spec: Config.of({
              name: Value.text({
                name: "Subdomain name",
                required: {
                  default: null,
                },
                description:
                  'The subdomain of your Start9 Pages .onion address to host the website on. For example, a value of "me" would produce a website hosted at http://me.xxxxxx.onion.',
                warning: null,
                masked: false,
                placeholder: null,
                inputmode: "text",
                patterns: [
                  {
                    regex: "^[a-z-]+$",
                    description:
                      "May contain only lowercase characters and hyphens",
                  },
                ],
                minLength: null,
                maxLength: null,
              }),
              settings: Value.union(
                {
                  name: "Settings",
                  description: null,
                  warning: null,
                  required: { default: "web-page" },
                },
                Variants.of({
                  "web-page": {
                    name: "Web Page",
                    spec: Config.of({
                      source: Value.select(
                        {
                          name: "Folder Location",
                          description:
                            "The service that contains your website files.",
                          warning: null,
                          required: {
                            default: "nextcloud",
                          },
                          values: {
                            filebrowser: "filebrowser",
                            nextcloud: "nextcloud",
                          },
                        } as const,
                      ),
                      folder: Value.text({
                        name: "Folder Path",
                        required: {
                          default: null,
                        },
                        description:
                          'The path to the folder that contains the website files. For example, a value of "projects/resume" would tell Start9 Pages to look for that folder path in the selected service.',
                        warning: null,
                        masked: false,
                        placeholder: "e.g. websites/resume",
                        inputmode: "text",
                        patterns: [
                          {
                            regex:
                              "^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$",
                            description: "Must be a valid relative file path",
                          },
                        ],
                        minLength: null,
                        maxLength: null,
                      }),
                    }),
                  },
                  redirect: {
                    name: "Redirect",
                    spec: Config.of({
                      target: Value.text({
                        name: "Target Subdomain",
                        required: {
                          default: null,
                        },
                        description:
                          "The subdomain of your Start9 Pages .onion address to redirect to. This should be the name of another subdomain on Start9 Pages. Leave empty to redirect to the homepage.",
                        warning: null,
                        masked: false,
                        placeholder: null,
                        inputmode: "text",
                        patterns: [
                          {
                            regex: "^[a-z-]+$",
                            description:
                              "May contain only lowercase characters and hyphens.",
                          },
                        ],
                        minLength: null,
                        maxLength: null,
                      }),
                    }),
                  },
                }),
              ),
            }),
            displayAs: "{{name}}",
            uniqueBy: "name",
          },
        ),
      ),
    }),
  })),
});
export const matchConfigSpec = configSpec.validator();
export type ConfigSpec = typeof matchConfigSpec._TYPE;
