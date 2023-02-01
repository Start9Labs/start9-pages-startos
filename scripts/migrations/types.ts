import { matches } from "../deps.ts";

const { shape, string, literal, any, arrayOf } = matches;

export const matchFilebrowserHomepage = shape({
  homepage: shape({
    type: literal("filebrowser"),
    directory: string,
  }, ["directory"]),
});

export const matchWebPageHomepage = shape({
  homepage: shape({
    type: literal("web-page"),
    source: string,
    folder: string,
  }, ["source"]),
});

export const matchFilebrowserSubdomain = shape({
  name: string,
  settings: shape({
    type: literal("filebrowser"),
    directory: string,
  }),
});

export const matchWebPageSubdomain = shape({
  name: string,
  settings: shape({
    type: string,
    source: string,
    folder: string,
  }),
});

export const matchSubdomains = shape({
  subdomains: arrayOf(shape({
    name: string,
    settings: any,
  })),
});