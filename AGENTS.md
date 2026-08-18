# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **Everything the reconciler must react to has to ride in a hashed field.** Dependency mounts go through the subcontainer descriptor; the effective nginx config goes through `exec.env.CONF_HASH`. A change the reconciler cannot see is a change nginx never picks up.
- **One nginx process serves every site.** All `listen` directives live in one config — don't split this into per-page daemons, which would mean N containers each binding one MultiHost port for no correctness gain.
- **The config goes on the `main` volume, not the container rootfs.** The daemon runs off a lazy subcontainer, so nothing can be written into its rootfs from `main.ts`; nginx is pointed at the volume copy with `-c`.
- **Repeat the security headers inside a CORS server block.** nginx's `add_header` in a server block replaces the http-level set rather than adding to it, so omitting them silently drops frame, sniffing, referrer, and XSS protection on exactly the sites that are cross-origin readable.
- **`kind: 'exists'` for both sources is correct** — the files are read off their volumes, which does not require those services to be running. Both mounts must stay read-only.
