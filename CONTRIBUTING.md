# Contributing

This repo packages [Start9 Pages](https://github.com/Start9Labs/start9-pages-startos) for StartOS. Start9 Pages is a Start9-maintained service with no separate upstream project — the application source lives in this repository alongside the packaging.

## Documentation — keep it in sync

- **`README.md`** — what this package is and how it's built (image, volumes, interfaces). For developers and AI assistants.
- **`instructions.md`** — the user-facing instructions packed into the `.s9pk` and shown on the **Instructions** tab in StartOS, for the person running the service.
- **`CONTRIBUTING.md`** — this file.
- **`CLAUDE.md`** — operating rules for AI developers working in this repo.

**Any code change that warrants it must update `README.md` and `instructions.md` in the same change** — a new or renamed action, an added or removed volume / port / interface / dependency, a changed default, a new limitation, any altered user-visible behavior. Don't defer: a package that ships with a stale README or stale instructions is not done, even if the code is perfect. Content rules live in the packaging guide: [Writing READMEs](https://docs.start9.com/packaging/writing-readmes.html) and [Writing Service Instructions](https://docs.start9.com/packaging/writing-instructions.html).

## Building

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/) for environment setup, then:

```bash
npm ci    # install dependencies
make      # build the universal .s9pk
```

## Updating the upstream version

There is no external upstream release feed for this package — the runtime image is built from the local `Dockerfile` at the repo root via `dockerBuild` in `startos/manifest/index.ts`, so there is no `dockerTag` to bump.

To change what ships:

1. Edit the `Dockerfile` (currently `FROM fholzer/nginx-brotli`, plus the `nextcloud-data` / `filebrowser-data` group setup) and/or `startos/main.ts` (nginx config generation, mounts, daemon definition).
2. Bump `version` and update `releaseNotes` in the file under `startos/versions/`. A *new* version file is only needed when the bump carries an `up`/`down` migration, or when you want the old release notes preserved in git history — see [Versions](https://docs.start9.com/packaging/versions.html).
3. Rebuild (`make`), sideload the `.s9pk`, and confirm it starts and serves a configured site.
4. Review `README.md` and `instructions.md` for anything the bump changed.

## How to contribute

1. Fork the repository and create a branch from `master`.
2. Make your changes — including the doc updates above.
3. Open a pull request to `master`.
