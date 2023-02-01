import { compat } from "../deps.ts";

export const getConfig = compat.getConfig({
  "tor-address": {
    "name": "Tor Address",
    "description": "The Tor address.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "embassy-pages",
    "target": "tor-address",
    "interface": "main",
  },
  "homepage": {
    "name": "Homepage",
    "description":
      "The page that will be displayed when your Embassy Pages .onion address is visited. Since this page is technically publicly accessible, you can choose to which type of page to display.",
    "type": "union",
    "default": "welcome",
    "tag": {
      "id": "type",
      "name": "Type",
      "variant-names": {
        "welcome": "Welcome",
        "index": "Subdomain Index",
        "web-page": "Web Page",
        "redirect": "Redirect",
        "fuck-off": "Fuck Off",
      },
    },
    "variants": {
      "welcome": {},
      "index": {},
      "web-page": {
        "source": {
          "name": "Internal data storage",
          "description": "The service that contains the static files for your website",
          "type": "enum",
          "values": [
            "filebrowser",
            "nextcloud",
            "gitea"
          ],
          "value-names": {},
          "default": "filebrowser",
        },
        "folder": {
          "type": "string",
            "name": "Folder Path",
            "description":
              'The path to the folder that contains the static files of your website. For example, a value of "projects/resume" would tell Embassy Pages to look for that folder path in the selected service.',
            "pattern":
              "^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$",
            "pattern-description": "Must be a valid relative file path",
            "nullable": false,
        }
      },
      "redirect": {
        "target": {
          "type": "string",
          "name": "Target Subdomain",
          "description":
            "The name of the subdomain to redirect users to. This must be a valid subdomain site within your Embassy Pages.",
          "pattern": "^[a-z-]+$",
          "pattern-description":
            "May contain only lowercase characters and hyphens.",
          "nullable": false,
        },
      },
      "fuck-off": {},
    }
  },
  "subdomains": {
    "type": "list",
    "name": "Subdomains",
    "description": "The websites you want to serve.",
    "default": [],
    "range": "[0, *)",
    "subtype": "object",
    "spec": {
      "unique-by": "name",
      "display-as": "{{name}}",
      "spec": {
        "name": {
          "type": "string",
          "nullable": false,
          "name": "Subdomain name",
          "description":
            'The subdomain of your Embassy Pages .onion address to host the website on. For example, a value of "me" would produce a website hosted at http://me.myaddress.onion.',
          "pattern": "^[a-z-]+$",
          "pattern-description":
            "May contain only lowercase characters and hyphens",
        },
        "settings": {
          "type": "union",
          "name": "Settings",
          "description":
            "The desired behavior you want to occur when the subdomain is visited. You can either redirect to another subdomain, or load a web page stored in File Browser.",
          "default": "web-page",
          "tag": {
            "id": "type",
            "name": "Type",
            "variant-names": {
              "web-page": "Web Page",
              "redirect": "Redirect",
            },
          },
          "variants": {
            "web-page": {
              "source": {
                "name": "Internal data storage",
                "description": "The service that contains the static files for your website",
                "type": "enum",
                "values": [
                  "filebrowser",
                  "nextcloud",
                  "gitea"
                ],
                "value-names": {},
                "default": "filebrowser",
              },
              "folder": {
                "type": "string",
                  "name": "Folder Path",
                  "description":
                    'The path to the folder that contains the static files of your website. For example, a value of "projects/resume" would tell Embassy Pages to look for that folder path in the selected service..',
                  "pattern":
                    "^(\\.|[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)(/[a-zA-Z0-9_ -][a-zA-Z0-9_ .-]*|/([a-zA-Z0-9_ .-][a-zA-Z0-9_ -]+\\.*)+)*/?$",
                  "pattern-description": "Must be a valid relative file path",
                  "nullable": false,
              }
            },
            "redirect": {
              "target": {
                "type": "string",
                "name": "Target Subdomain",
                "description":
                  "The subdomain of your Embassy Pages .onion address to redirect to. This should be the name of another subdomain on Embassy Pages. Leave empty to redirect to the homepage.",
                "pattern": "^[a-z-]+$",
                "pattern-description":
                  "May contain only lowercase characters and hyphens.",
                "nullable": false,
              },
            },
          },
        },
      },
    },
  },
});
