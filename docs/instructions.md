# Using Embassy Pages

## General Info

Embassy Pages relies on File Browser to store its website directories. All your Embassy Pages sites are hosted on unique subdomains. For example, one site could be `http://hello.myaddress.onion` and another could be `http://goodbye.myaddress.onion`. You chose the subdomain for each site.

## Instructions

1. Place your static website files into a directory inside File Browser.
1. Open the Embassy Pages service and select the Config sub-menu.
1. Add a new site by selecting "Subdomains" from the Config Options menu:
   - Click the `+` in the upper right hand corner.
   - Choose your desired subdomain. For example: `me`
   - Provide the path to the directory in File Browser. For example: `websites/my_resume`
1. Click save, then start Embassy Pages. It will automatically restart if it was already running.
1. Your site will now be hosted at `http://me.myaddress.onion`, visible from any Tor-enabled browser.
1. You can view and access all your saved websites inside Properties.

## Changing Welcome Page

Keep in mind that if you expose the URL of a subdomained Embassy Pages' website, the default Embassy Pages' website will also be exposed (and can be accessed by deleting the subdomained portion of the URL).

If you would like to change the default welcome page for your Embassy Pages' website for this case, navigate to `Config > Homepage`. Change the type to your desired option.

The various options include:
 - Index of subdomains: renders a page with a list of all subdomain pages you added.
 - File Browser Directory: points the Embassy Pages' website address to the specified directory in File Browser. This is useful if you want a customized default page for your Embassy Pages service.
 - Redirect: enables the Embassy Pages website address to redirect to one of your specified subdomain sites.
 - Fuck Off: kindly dissuades unauthorized viewing of your Embassy Pages' website.