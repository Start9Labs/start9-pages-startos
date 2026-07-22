# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `start9-pages`.** A single-image nginx static-site host. The website list lives in `store.json` on the `main` volume; each configured website is published as its own dynamic `ui` interface whose id is the website's auto-assigned port (`interfaces.ts`).
- **`main.ts` is `sdk.setupMain` returning a `sdk.Daemons.dynamic` reconciler** (requires start-sdk ≥ 2.0.4). `main` is _always_ `setupMain`; what varies is the `DaemonBuildable` it returns — here the reconciler rather than a static `Daemons.of` chain. Do not invert that (`main = sdk.Daemons.dynamic(...)` was the pre-2.0.4 shape the SDK's own signatures forced; it is wrong). The `pages` store read lives inside the dynamic builder so a page add/remove/edit drives a reconcile rather than a whole-service restart. nginx serves every page from one process, so it is a **single** reconciled daemon (`primary`): the nginx config is generated from the store, written to the `main` volume under `/data/nginx/` (which is mounted into the container), and nginx is pointed at it with `-c`. A sha256 of the effective config rides in the daemon's `exec.env.CONF_HASH`; the reconciler hashes that field, so nginx restarts exactly when the config changes. The filebrowser/nextcloud dependency mounts are part of the (hashed) subcontainer descriptor. Do NOT write config into the lazy subcontainer's rootfs, and do NOT call `.build()` on the returned chain.
- **Optional dependencies filebrowser + nextcloud.** `main.ts` imports `manifest` from `filebrowser-startos/startos/manifest` and `nextcloud-startos/startos/manifest` and mounts their data volumes read-only (`/mnt/filebrowser`, `/mnt/nextcloud`) as the website file sources. A dependency is only required/mounted when a website actually uses that source.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach start9-pages -n primary -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `primary`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
