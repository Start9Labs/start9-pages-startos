# Using Embassy Pages

## General Info

Embassy Pages relies on File Browser to store its website directories. All your Embassy Pages sites are hosted on unique subdomains. For example, one site could be `http://hello.myaddress.onion` and another could be `http://goodbye.myaddress.onion`. You chose the subdomain for each site.

## Instructions

1. Place your static website files into a directory inside File Browser.
1. On your Embassy, navigate to: "Embassy Pages" > "Config".
1. Add a new Site.
   - Choose your desired subdomain. For example: `me`
   - Provide the path to the directory in File Browser. For example: `websites/my_resume`
1. Click save, then start Embassy Pages. It will restart automatically if it was already running.
1. Your site will now be hosted at `http://me.myaddress.onion`, visible from any Tor-enabled browser.
1. You can view and access all your saved websites inside Properties.
