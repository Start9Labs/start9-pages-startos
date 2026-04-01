<p align="center">
  <img src="icon.svg" alt="Project Logo" width="21%">
</p>

# Start9 Pages for StartOS

This repository packages Start9 Pages for StartOS. This is a Start9-developed service for hosting static websites.

## How This Differs from Generic Static Hosting

Start9 Pages is purpose-built for StartOS. It integrates directly with File Browser and Nextcloud to serve static websites from files you've already uploaded. Each website gets its own network interface with Tor, LAN, and custom domain support.

## Container Runtime

This package runs **1 custom container**:

| Container | Image | Purpose |
|-----------|-------|---------|
| pages | Custom (nginx + brotli) | Static file server |

The container is based on nginx with Brotli compression support for optimal performance.

## Volumes

| Volume | Contents | Backed Up |
|--------|----------|-----------|
| `main` | Website configuration (store.json) | Yes |

Website files are not stored in this volume - they're read directly from File Browser or Nextcloud.

## Install Flow

On installation:
1. Creates task prompting to "Add your first website!" if no sites configured

## Configuration Management

### Auto-Configured Settings

Nginx is configured with:

| Setting | Value | Purpose |
|---------|-------|---------|
| Brotli compression | Level 5 | Modern compression for text/CSS/JS |
| Gzip compression | Level 6 | Fallback compression |
| Static asset cache | 30 days | CSS, JS, images, fonts |
| Security headers | X-Frame-Options, CSP, etc. | XSS protection |
| Default server | Returns 444 | Silently close unknown hosts |

### User-Configurable Settings

All configuration is done through the **Manage Websites** action.

## Network Interfaces

Interfaces are **dynamic** - one per configured website:

| Interface | Type | Port | Description |
|-----------|------|------|-------------|
| (per website) | ui | 8000+ | Each website gets unique port |

Ports are auto-assigned starting at 8000. Each website gets its own set of addresses (LAN, Tor, custom domains).

## Actions

### Manage Websites

Add, edit, and remove static websites.

**Per-website options:**
- **Name**: Display name for the website
- **Source**: File Browser or Nextcloud
- **User** (Nextcloud only): Which Nextcloud user's files to use
- **Folder Location**: Path to the folder containing your website files

Websites are served if they contain `index.html`, `index.htm`, or `index`. Directory listing is enabled for folders without an index file.

**Creates task on install** if no websites are configured.

## Dependencies

| Dependency | Requirement | When Required |
|------------|-------------|---------------|
| File Browser | >=2.52.0, exists | When any website uses File Browser source |
| Nextcloud | >=31.0.12, exists | When any website uses Nextcloud source |

Dependencies are **conditional** - only required when you configure a website to use that source. You need at least one of File Browser or Nextcloud to host websites.

## Backups

Only configuration is backed up:
- `main` volume - website configuration

Website files are stored in File Browser or Nextcloud and backed up with those services.

## Health Checks

| Check | Method | Success Condition |
|-------|--------|-------------------|
| Hosting | Port listening | Port 80 responds |

The health check monitors nginx availability, not individual websites.

## How to Use

1. Upload your static website files to File Browser or Nextcloud
2. Run the **Manage Websites** action
3. Add a new website:
   - Give it a name
   - Select source (File Browser or Nextcloud)
   - Enter the path to your website folder
4. Save and restart the service
5. Access your website via the new interface that appears

## Limitations

1. **Static sites only**: No server-side processing (PHP, Node.js, etc.)
2. **No SSL certificates per site**: SSL handled by StartOS at the network level
3. **Requires external storage**: Must use File Browser or Nextcloud for files
4. **No build process**: Sites must be pre-built (HTML/CSS/JS ready to serve)

## What's Included

- Nginx with Brotli compression
- Automatic gzip fallback
- Security headers (XSS protection, content-type sniffing prevention)
- Static asset caching
- Directory listing for non-index folders
- Multiple website support

---

## Quick Reference (YAML)

```yaml
package_id: start9-pages
containers:
  - name: pages
    image: custom (nginx + brotli)

volumes:
  main:
    backup: true
    contents: website configuration

interfaces:
  dynamic: true
  per_website:
    type: ui
    port: 8000+

actions:
  - id: manage
    name: Manage Websites
    has_input: true
    options:
      - name
      - source (filebrowser | nextcloud)
      - path
      - user (nextcloud only)

dependencies:
  filebrowser:
    optional: true
    required_when: website uses filebrowser source
  nextcloud:
    optional: true
    required_when: website uses nextcloud source

auto_configure:
  - nginx security headers
  - brotli compression (level 5)
  - gzip compression (level 6)
  - static asset caching (30 days)
  - auto port assignment (8000+)

health_checks:
  - name: Hosting
    method: port_listening
    port: 80

install_tasks:
  - Manage Websites (if no sites configured)
```
