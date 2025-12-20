# Start9 Pages Instructions

## Adding a Website

1. Start9 Pages reads from File Browser or Nextcloud. So at least one of these must be installed.
1. Upload a single folder containing your website files to File Browser or NextCloud. A typical website folder will look like the following. The folder _must_ contain one of: `index`, `index.html`, or `index.htm`.

   ```bash
   marketing-site/
   ├── index.html
   ├── about.html
   ├── contact.html
   ├── css/
   │   └── style.css
   ├── js/
   │   └── script.js
   └── images/
       ├── logo.png
       └── hero.jpg
   ```

1. In Start9 Pages, select Actions -> Manage Websites
1. Click `+ Add`
1. Give your website a name, select the service where the website folder is stored, and enter the full path to the folder. For example `Websites/marketing-site`.
1. By default, newly added websites receive a unique port for LAN access and a unique onion URL for Tor access. To host your website on the public Internet, follow instructions for <a href="https://docs.start9.com/user-manual/connecting-remotely/clearnet">adding public domains to StartOS</a>.
