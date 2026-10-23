# Updating the version

Start9 Pages is a Start9 Labs first-party package — there is no external upstream project. The runtime image is built locally from the repo's `Dockerfile` via `dockerBuild` in `startos/manifest/index.ts` (no `dockerTag` to bump), so the upstream half of the version is Start9 Pages' own version, chosen here.

## Choosing the version

The version is `version` in `startos/versions/current.ts` (e.g. `'1.1.0:0'`).

- **A new feature** bumps the minor (`1.0.0:20` → `1.1.0:0`); **a fix to the app's behavior** bumps the patch (`1.1.0:0` → `1.1.1:0`). Either resets the revision to `0`.
- **A packaging-only change** (image, SDK, dependencies) bumps the revision (`1.1.0:0` → `1.1.0:1`).
- A change to a version beta does not serve yet ships under that same version, its release note added to the ones already there.

## Applying the bump

Edit `version` and `releaseNotes` (every locale) in `startos/versions/current.ts` in place. Leave `startos/versions/index.ts` alone unless the bump introduces an `up`/`down` migration.
