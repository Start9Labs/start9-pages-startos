# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Everything the reconciler must react to has to ride in a hashed field.** Dependency mounts go through the subcontainer descriptor; the effective nginx config goes through `exec.env.CONF_HASH`. A change the reconciler cannot see is a change nginx never picks up.
- **One nginx process serves every site.** All `listen` directives live in one config — don't split this into per-page daemons, which would mean N containers each binding one MultiHost port for no correctness gain.
- **The config goes on the `main` volume, not the container rootfs.** The daemon runs off a lazy subcontainer, so nothing can be written into its rootfs from `main.ts`; nginx is pointed at the volume copy with `-c`.
- **Repeat the security headers inside a CORS server block.** nginx's `add_header` in a server block replaces the http-level set rather than adding to it, so omitting them silently drops frame, sniffing, referrer, and XSS protection on exactly the sites that are cross-origin readable.
- **`kind: 'exists'` for both sources is correct** — the files are read off their volumes, which does not require those services to be running. Both mounts must stay read-only.
