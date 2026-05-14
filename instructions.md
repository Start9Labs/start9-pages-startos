# Start9 Pages

## What you get on StartOS

- A static-site host that serves websites directly from files already stored in **File Browser** or **Nextcloud** on your server.
- One **interface per website** — every site you add gets its own LAN, Tor, and custom-domain addresses, on its own auto-assigned port.
- Built-in compression (Brotli and gzip), long-lived caching for hashed assets, and standard security headers — applied to every site you host.

## Getting set up

You need at least one of **File Browser** or **Nextcloud** installed and running, with your website files already uploaded there. Install whichever you plan to use first, then upload each site's files into a folder you can name.

After install, Start9 Pages posts a critical task — **Add your first website!** — that opens the **Manage Websites** action. To add a site:

1. Click **Add** under **Websites**.
2. Give the site a **Name** (used to label its interface).
3. Pick a **Source** — Filebrowser or Nextcloud. For Nextcloud, enter the **Nextcloud User** whose files you're serving (default `admin`).
4. Enter the **Folder Location** — the path to the folder, relative to the source's root, e.g. `websites/marketing-site`. For Nextcloud this is the path inside that user's files.
5. Save. Start9 Pages assigns a port (starting at 8000), generates an nginx config, and exposes the site as a new interface.

If the folder contains `index.html`, `index.htm`, or `index`, that page is served at the root. Folders without an index file are served as a browsable directory listing.

## Using Start9 Pages

### Hosted websites

Each site you've added shows up as its own interface, named after the site. Open the interface to find that site's LAN address, Tor `.onion`, and the controls to attach a custom domain. The site is served as soon as Start9 Pages is running.

### Actions

- **Manage Websites** — add, rename, remove, or repoint your hosted sites, and switch a site between File Browser and Nextcloud sources. Saving applies a new nginx config and the interfaces update to match.

## Limitations

- **Static files only.** There is no server-side runtime — no PHP, no Node, no CGI. Build your site to plain HTML/CSS/JS before uploading it.
- **Files live in File Browser or Nextcloud, not here.** Start9 Pages only stores the website list; the actual files are read from the source service. Backups of Start9 Pages preserve your site list, but the file contents are backed up by File Browser or Nextcloud.
