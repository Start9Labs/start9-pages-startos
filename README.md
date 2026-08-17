<p align="center">
  <img src="icon.svg" alt="Start9 Pages Logo" width="21%">
</p>

# Start9 Pages on StartOS

> Everything not listed in this document should behave the same as upstream
> nginx. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

Start9 Pages is static web hosting for files you already have on this server. Point it at a folder in File Browser or Nextcloud and it serves that folder as a website — one nginx process, one port and one address per site.

- **Upstream repo:** <https://github.com/Start9Labs/start9-pages-startos>
- **Wrapper repo:** <https://github.com/Start9Labs/start9-pages-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built locally around nginx with Brotli.

| Property      | Value                                              |
| ------------- | -------------------------------------------------- |
| Image         | Built from `Dockerfile`                            |
| Architectures | x86_64, aarch64                                    |
| Command       | `nginx -c /data/nginx/nginx.conf -g 'daemon off;'` |

| Subcontainer | Purpose                                   |
| ------------ | ----------------------------------------- |
| `primary`    | The nginx daemon — the one to `attach` to |

**The daemon is dynamic, and that is the point.** Adding, editing, or removing a site does not restart the service: the whole page list is read inside a reconciling daemon builder, so nginx is updated in place and the service stays running throughout.

One nginx process serves every site — all the `listen` directives live in one config — so a single reconciled daemon is the right shape. Per-site daemons would mean one nginx container per site, each binding one port, for no correctness gain.

What the reconciler reacts to is surfaced through hashed fields: dependency mounts ride in the subcontainer descriptor, and a SHA-256 of the effective nginx config rides in an environment variable. **nginx restarts exactly when the config it serves changes**, and not otherwise.

**The config is written to the volume, not the container's root filesystem.** The daemon runs off a lazily-created subcontainer, so nothing can be written into its rootfs beforehand — instead both config files go to the `main` volume, which is also mounted in the container, and nginx is pointed at them explicitly.

## Volume and Data Layout

One volume of its own, plus a read-only view of whichever source each site uses.

| Volume | Mount Point | Purpose                                     |
| ------ | ----------- | ------------------------------------------- |
| `main` | `/data`     | `store.json` and the generated nginx config |

**None of the website content is here.** Each site's files stay on the source service's own volume, mounted read-only into this container — File Browser's at `/mnt/filebrowser`, Nextcloud's at `/mnt/nextcloud`. This package serves them; it never copies them.

## File Models

One model, holding the whole site list.

| File         | Format | Modelled                | Written by                 |
| ------------ | ------ | ----------------------- | -------------------------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | The Manage Websites action |

Each entry carries a port, a display name, whether CORS is on, and a source — either a Nextcloud user and path, or a File Browser path. That list drives everything: the interfaces published, the dependencies declared, the mounts attached, and the nginx config generated.

**The nginx config is generated, never edited.** Both files are rewritten from the site list on every reconcile, so a hand edit is replaced the next time anything changes.

Two things the generated config does that are worth knowing:

- **A catch-all server block closes any connection that does not match a site**, silently, rather than serving something by accident.
- **Turning CORS on re-states the security headers.** nginx's `add_header` replaces the inherited set for a server block rather than adding to it, so the CORS block repeats the frame, sniffing, referrer, and XSS headers it would otherwise drop.

## Dependencies

Two, both optional, and each declared only while a site actually uses it.

| Dependency    | Kind     | Required when                         |
| ------------- | -------- | ------------------------------------- |
| `filebrowser` | `exists` | Any site is sourced from File Browser |
| `nextcloud`   | `exists` | Any site is sourced from Nextcloud    |

Both volumes are mounted **read-only**: this package can serve those files but never modify them.

## Network Access and Interfaces

**There is no fixed interface list — one is published per site.** Each entry in the site list becomes its own interface on its own port and its own MultiHost, named as you named the site.

| Interface       | Id            | Type | Port          |
| --------------- | ------------- | ---- | ------------- |
| One per website | the site port | ui   | the site port |

None are masked. A fresh install with no sites publishes nothing at all.

**Each site gets its own address**, which is what makes it possible to give one site a domain and keep another on the LAN.

## Installation and First-Run Flow

Install starts nginx with no sites and raises a `critical` task: add your first website.

Before that is useful, the content has to exist somewhere this package can read — a folder in File Browser or Nextcloud with an `index.html` in it. Then Manage Websites points a port at that folder.

The task is checked on every start, so removing every site brings it back.

## Actions

One action.

### Manage Websites

Add, edit, and remove the sites this package serves.

- **What it changes:** the `pages` list in `store.json`, and through it the published interfaces, the declared dependencies, the container's mounts, and the generated nginx config.
- **Cost:** seconds. **No restart of the service** — the daemon reconciles in place, and nginx restarts only if the config content actually changed.
- **Repeat safety:** idempotent; the form is pre-filled with the current list.
- **Removing a site removes its interface and its address.** The files themselves are untouched, since they live on the source service.
- **CORS is per site**, off unless you turn it on. Turn it on only for a site whose assets are meant to be fetched from another origin.
- **Each site needs its own port**, and that port is what its address is built from.

## Tasks

One task, and it can come back.

| Task            | Severity   | Raised when             | Cleared when    |
| --------------- | ---------- | ----------------------- | --------------- |
| Manage Websites | `critical` | No sites are configured | The action runs |

Checked on every init rather than only at install. `critical` because with no sites the service publishes nothing and does nothing — it is running, but there is no address to visit.

## Health Checks

One check, on the only daemon.

| Check     | Displayed | Method               |
| --------- | --------- | -------------------- |
| `primary` | "Hosting" | Port 80 is listening |

The port checked is the catch-all block's, not any site's, so this reports that nginx came up rather than that a given site works. A failure means nginx rejected the generated config, and the service logs name the directive.

**A green check with a site returning 404** is a path problem, not a service problem: the folder is empty, has no `index.html`, or the path within the source service is wrong.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** `store.json` with the site list, and the generated nginx config.
- **Not included: none of the website content.** Those files belong to File Browser or Nextcloud, and are in _their_ backups. A restore of this package alone gives you the site definitions pointing at folders that may not exist.
- **Restore:** the sites and their ports come back, and the config is regenerated on the first start. Restore the source services alongside it, or the sites will serve nothing.

## Limitations and Differences

1. **Static files only.** There is no scripting, no database, and no server-side anything — nginx serves what is in the folder.
2. **Content is never copied.** A site is a read-only view of another service's folder, and disappears if that folder does.
3. **The website content is not in this package's backup.**
4. **Sources are limited to File Browser and Nextcloud.**
5. **The generated nginx config is not editable** — it is rewritten on every reconcile.
6. **Each site needs a distinct port**, chosen when you add it.
7. **No riscv64 build.** x86_64 and aarch64 only.

---

## Quick Reference for AI Consumers

```yaml
package_id: start9-pages
image: ./Dockerfile # nginx with brotli
architectures:
  - x86_64
  - aarch64
subcontainers:
  - primary # the nginx daemon; reconciled in place, not restarted per change
volumes:
  main: /data # store.json and the generated nginx config; no site content
file_models:
  - store.json
startos_managed_env_vars:
  - CONF_HASH # sha256 of the effective nginx config; drives the reconcile
dependencies: # each declared only while a site uses it; both mounted read-only
  - filebrowser # exists
  - nextcloud # exists
interfaces: {} # one ui interface per configured site, on that site's port
actions:
  - manage
tasks:
  - { action: manage, severity: critical } # re-raises whenever no site exists
health_checks:
  - primary # displayed "Hosting"; the catch-all block's port
```
