import { matches } from "../deps.ts";

const { shape, string, literal, any, arrayOf } = matches;

export const matchFilebrowserHomepage = shape({
  type: literal("filebrowser"),
  directory: string,
}, ["directory"]);

export const matchWebPageHomepageOld = shape({
  type: string,
  source: string,
  folder: string,
});

export const matchWebPageHomepage = shape({
  type: string,
  source: shape({
    type: string,
    folder: string,
    user: string,
  }, ["user"]),
});

export const matchFuckOffHomepageConfig = shape({
  homepage: shape({
    type: literal("fuck-off"),
  }),
});

export const matchFilebrowserHomepageConfig = shape({
  homepage: matchFilebrowserHomepage,
});

export const matchWebPageHomepageConfig = shape({
  homepage: matchWebPageHomepage,
});

export const matchWebPageHomepageConfigOld = shape({
  homepage: matchWebPageHomepageOld,
});

export const matchFilebrowserSubdomain = shape({
  name: string,
  settings: shape({
    type: literal("filebrowser"),
    directory: string,
  }),
});

export const matchWebPageSubdomainOld = shape({
  name: string,
  settings: shape({
    type: string,
    source: string,
    folder: string,
  }),
});

export const matchWebPageSubdomain = shape({
  name: string,
  settings: shape({
    type: string,
    source: shape({
      type: string,
      folder: string,
      user: string,
    }, ["user"]),
  }),
});

export const matchSubdomains = shape({
  subdomains: arrayOf(shape({
    name: string,
    settings: any,
  })),
});
