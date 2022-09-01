import { matches, types as T, YAML } from "../deps.ts";
const { shape, string, boolean, literal } = matches;

// deno-lint-ignore no-explicit-any
const asResult = (result: any) => ({ result: result as T.Properties });
const noPropertiesFound: T.ResultType<T.Properties> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value: "Could not find properties. The service might still be starting",
        qr: false,
        copyable: false,
        masked: false,
        description: "Fallback Message When Properties could not be found",
      },
    },
  },
} as const;

const matchSubdomain = shape({
  name: string,
  settings: shape({
    type: string,
    directory: string,
  }),
});

const matchesConfig = shape({
  subdomains: matches.arrayOf(matchSubdomain),
  "tor-address": string,
  homepage: shape({
    type: string,
  }),
});

const matchPackagePropertyString = shape(
  {
    type: literal("string"),
    description: string,
    value: string,
    copyable: boolean,
    qr: boolean,
    masked: boolean,
  },
  ["description", "copyable", "qr", "masked"],
  {
    copyable: false,
    qr: false,
    masked: false,
  } as const,
);

type PropertyString = typeof matchPackagePropertyString._TYPE;

export const properties: T.ExpectedExports.properties = async (effects) => {
  const config = await effects.readFile({
    volumeId: "main",
    path: "start9/config.yaml",
  }).then(YAML.parse).then((x) => matchesConfig.unsafeCast(x))
    .catch(() => undefined);
  // if subdomains exist, display them in properties
  if (config && config.subdomains.length > 0) {
    const subdomains: { [key: string]: PropertyString } = {};
    config.subdomains.map((s) => {
      subdomains[s.name] = {
        type: "string",
        description: `Link for the site ${s.name}`,
        value: `${s.name}.${config["tor-address"]}`,
        copyable: true,
        qr: true,
        masked: false,
      };
    });
    const result = {
      version: 2,
      data: {
        subdomains: {
          value: subdomains,
          type: "object",
          description: "The available configured subdomains",
        },
      },
    };
    await effects.writeFile({
      path: "start9/stats.yaml",
      volumeId: "main",
      toWrite: YAML.stringify(result),
    });
    return asResult(result);
  } else if (config && config.subdomains.length === 0) {
    return asResult({
      version: 2,
      data: {},
    });
  } else {
    return noPropertiesFound;
  }
};
