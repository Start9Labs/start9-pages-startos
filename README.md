<p align="center">
  <img src="icon.svg" alt="Start9 Pages Logo" width="21%">
</p>

# Start9 Pages on StartOS

> **Upstream docs:** <https://github.com/Start9Labs/start9-pages-startos>
>
> Start9 Pages is a Start9-developed service. This document describes its
> behavior on StartOS.

Start9 Pages is a purpose-built static website hosting service for StartOS. It integrates directly with File Browser and Nextcloud to serve static websites from files you've already uploaded. Each website gets its own network interface with Tor, LAN, and custom domain support.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | Custom Dockerfile (nginx with Brotli compression) |
| Architectures | x86_64, aarch64 |
| Entrypoint | `nginx -g 'daemon off;'` |

## Volume and Data Layout

| Volume | Mount Point | Contents |
|--------|-------------|---------|
| `main` | `/data` | Website configuration (`store.json`) |

Website files are not stored in this volume — they are read directly from File Browser's `data` volume or Nextcloud's `nextcloud` volume via dependency mounts.

## Installation and First-Run Flow

On install:

1. A **critical setup task** is created prompting the user to run the **Manage Websites** action if no websites are configured

No credentials are generated — the service is ready to use once at least one website is configured.

## Configuration Management

| StartOS-Managed | User-Managed |
|-----------------|--------------|
| Nginx Brotli compression (level 5) | Website list (via Manage Websites action) |
| Nginx gzip compression (level 6, fallback) | Website names, sources, and folder paths |
| Static asset caching (30 days for CSS/JS/images/fonts) | |
| Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection) | |
| Default server returns 444 (silently closes unknown hosts) | |
| Auto-assigned ports (starting at 8000) | |

## Network Access and Interfaces

Interfaces are **dynamic** — one per configured website:

| Interface | ID | Type | Port | Protocol | Description |
|-----------|----|------|------|----------|-------------|
| (per website) | `<port>` | ui | 8000+ (auto-assigned) | HTTP | Each website gets its own interface and port |

Ports are auto-assigned starting at 8000. Each website gets its own set of addresses (LAN, Tor, custom domains).

## Actions (StartOS UI)

### Manage Websites (`manage`)

Add, edit, and remove static websites.

| Property | Value |
|----------|-------|
| **Name** | Manage Websites |
| **Purpose** | Add, edit, and remove hosted websites |
| **Visibility** | Enabled |
| **Availability** | Any (running or stopped) |
| **Inputs** | List of websites, each with: Name (text, required), Source (union: Filebrowser or Nextcloud), Folder Location (text, required), User (text, Nextcloud only, default: "admin"). Port is hidden/auto-assigned. |
| **Outputs** | Website list saved to `store.json`; service restarts to apply nginx configuration |

Websites are served if they contain `index.html`, `index.htm`, or `index`. Directory listing is enabled for folders without an index file.

## Backups and Restore

- **Backed up:** `main` volume (website configuration in `store.json`)
- **Not backed up:** Website files (stored in File Browser or Nextcloud and backed up with those services)
- **Restore behavior:** Configuration is restored in place; service resumes serving previously configured websites

## Health Checks

| Check | Daemon | Method | Success Condition |
|-------|--------|--------|-------------------|
| Hosting | primary | Port listening (80) | Port 80 responds |

The health check monitors nginx availability, not individual websites.

## Dependencies

### File Browser (optional)

| Property | Value |
|----------|-------|
| **Service** | File Browser |
| **Required/Optional** | Optional — only required when any website uses the Filebrowser source |
| **Health checks** | None (kind: `exists`) |
| **Mounted volumes** | `data` volume mounted at `/mnt/filebrowser` (read-only) |
| **Purpose** | Provides static website files for hosting |

### Nextcloud (optional)

| Property | Value |
|----------|-------|
| **Service** | Nextcloud |
| **Required/Optional** | Optional — only required when any website uses the Nextcloud source |
| **Health checks** | None (kind: `exists`) |
| **Mounted volumes** | `nextcloud` volume mounted at `/mnt/nextcloud` (read-only) |
| **Purpose** | Provides static website files for hosting; files accessed at `data/<user>/files/<path>` |

You need at least one of File Browser or Nextcloud installed to host websites.

## Limitations and Differences

1. **Static sites only** — no server-side processing (PHP, Node.js, etc.)
2. **Requires external file storage** — must use File Browser or Nextcloud for website files
3. **No build process** — sites must be pre-built (HTML/CSS/JS ready to serve)
4. **No per-site SSL certificates** — TLS is terminated by StartOS at the network level

## What Is Unchanged from Upstream

This is a Start9-developed service with no upstream equivalent. All features are documented above.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: start9-pages
image: custom (nginx + brotli)
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  dynamic: 8000+ (one per website)
dependencies:
  - filebrowser (optional, mounts data volume read-only)
  - nextcloud (optional, mounts nextcloud volume read-only)
startos_managed_env_vars: []
actions:
  - manage
```
