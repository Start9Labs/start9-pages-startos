# Updating the upstream version

Start9 Pages is a Start9 Labs first-party package — there is no external upstream project. The runtime image is built locally from the repo's `Dockerfile` via `dockerBuild` in `startos/manifest/index.ts` (no `dockerTag` to bump), and the "upstream version" is whatever tag/release this same repo has cut. Bumping the package means cutting a new release here, then updating the version pin in this repo to match.

## Determining the upstream version

- **start9-pages-startos** ([GitHub](https://github.com/Start9Labs/start9-pages-startos)) — latest release tag of this repo:

  ```
  gh release view -R Start9Labs/start9-pages-startos --json tagName -q .tagName
  ```

  The pin lives in `startos/versions/<file>.ts` as the `version` field (e.g. `version: '1.0.0:8'`), with the file itself named to match (e.g. `startos/versions/v1.0.0.8.ts`) and re-exported from `startos/versions/index.ts` as `current`.

## Applying the bump

- **start9-pages-startos** — in `startos/versions/`:
  1. Rename the current version file to the new version (e.g. `v1.0.0.8.ts` → `v1.0.0.9.ts`) and update its exported binding (`v_1_0_0_8` → `v_1_0_0_9`).
  2. Update the `version` field inside that file to the new value (e.g. `'1.0.0:8'` → `'1.0.0:9'`) and refresh `releaseNotes` for every locale.
  3. Update `startos/versions/index.ts` to import the renamed binding and set it as `current` (leave `other: []` unless this bump introduces an `up`/`down` migration).
