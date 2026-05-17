# Start9 Pages

## Documentation

- [Start9 Pages on GitHub](https://github.com/Start9Labs/start9-pages-startos) — package source, full reference README, and issue tracker.

## What you get on StartOS

Start9 Pages is a static website host. Point it at folders that already live in **File Browser** or **Nextcloud** on your server and each folder becomes a published site:

- **One interface per site.** Every site you add gets its own set of network addresses — LAN IP, WAN IP, mDNS — on an auto-assigned port, plus the option to attach public domains and Tor `.onion` addresses.
- **No file copying.** Files are read directly from File Browser or Nextcloud (read-only mounts) — uploads, renames, and replacements there are reflected immediately.
- **Sensible defaults baked in.** Brotli and gzip compression, long-lived caching for hashed JS/CSS/image/font assets, and standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection`) apply to every site.

## Getting set up

**You need one of File Browser or Nextcloud installed and running first**, with your website files already uploaded there. Install whichever you plan to use, then place each site's files in a folder you can name.

After install, Start9 Pages posts a critical task — **Add your first website!** — which opens the **Manage Websites** action. To add a site:

1. Click **Add** under **Websites**.
2. Give the site a **Name** — this labels its interface in StartOS.
3. Choose a **Source** — File Browser or Nextcloud. For Nextcloud, also enter the **Nextcloud User** whose files you want served (default `admin`).
4. Enter the **Folder Location** — the path to the folder, relative to the source's data root. For File Browser this is e.g. `websites/marketing-site`. For Nextcloud, it's the path inside that user's files (Start9 Pages resolves it to `data/<user>/files/<path>` under the hood).
5. *(Optional)* Toggle **Allow CORS** on if the site needs to be readable by browsers running on other domains — most commonly for **Nostr NIP-05 identity verification**, where clients fetch `/.well-known/nostr.json` from your site. Off is the right default; only enable it on sites where you specifically need cross-origin access.
6. Save. Start9 Pages auto-assigns a port (starting at 8000), regenerates its nginx config, and exposes the site as a new interface.

If the folder contains `index.html` or `index.htm`, that file is served at the root. Folders without one are served as a browsable directory listing.

You can host as many sites as you want by repeating the **Add** flow.

## Using Start9 Pages

### Visiting your hosted sites

Each site you add appears as its own interface in StartOS, named after the site. Each interface exposes the site in three ways:

- **Built-in addresses** — LAN IP, WAN IP, and mDNS, all on the site's auto-assigned port. To reach the site at these addresses you must (a) include the port in the URL and (b) trust your server's Root CA in your browser, since StartOS signs its own TLS certs for these.
- **Custom public domains** — attach one or more domains (e.g. `mydomain.com`) to the interface. This is what most people actually want: once a domain is bound you visit `https://mydomain.com` directly, no port and no Root CA trust required.
- **Tor `.onion` addresses** *(optional)* — install the **Tor** service on your StartOS, then click **Add onion service** on the site's interface page to publish it as a hidden service. Visit the resulting `.onion` URL from any Tor-enabled browser; no port and no Root CA trust required.

### Editing or removing a site

Open **Manage Websites** again. Sites are listed in the order you added them; rename, repoint, or remove any of them from this same form. **Save** applies the new nginx config — the service briefly restarts and interfaces update to match.

You can also switch a site between File Browser and Nextcloud (or change the Nextcloud user) without removing and re-adding it — change the Source on that row and save.

### Auto-assigned ports

Ports start at 8000 and increment as you add sites. Once assigned, a site keeps its port even if you reorder or rename it; removing a site frees its port for the next one you add.

## Limitations

- **Static files only.** There is no server-side runtime — no PHP, Node, CGI, or rewrites. Build dynamic sites to plain HTML/CSS/JS before uploading.
- **Files live in File Browser or Nextcloud, not in Start9 Pages.** Start9 Pages only stores the website list (which folder, which source, which port). Backups of Start9 Pages preserve that list; the file contents are backed up wherever they live.
- **The folder must exist before you add it.** Start9 Pages does not create folders in File Browser or Nextcloud; if the path doesn't exist, the site will 404 until you create or upload to it.
