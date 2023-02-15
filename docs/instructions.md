# Pages

## About

Pages is a simple web server that uses folders inside a file hosting service, such as File Browser or Nextcloud, to serve Tor websites. Your website could be a blog, a resume, a portfolio, a business landing page, a product brochure, or just a set of static folders and/or files that you want to share with the world.

When you first install Pages, there will be a default Homepage hosted at the Tor address. You can change the behavior of this page, and you can also create Subdomain websites. For example, one site could be `hello.<pages-tor-address>.onion` and another could be `goodbye.<pages-tor-address>.onion`. What is served from the Homepage and each Subdomain is totally up to you.
   
Self-hosting Tor websites using Pages is easy, permissionless, and censorship-resistant; there are no trusted third parties involved. Anyone can do it. No one can stop it.

## Instructions

### Homepage

Inside `Config`, you can easily change the behavior of your Homepage to serve:

   1. A list of hyperlinks to all your Subdomains
   1. A personal web page
   1. An automatic redirect to a Subdomain
   1. A static web page that tells anyone visiting it to f*ck off, politely.

**NOTE:** Changing the Homepage setting requires a hard refresh when visiting the Tor address in a browser #caching.

### Subdomains

Inside `Config`, you can create one or more Subdomains, giving each a unique name and custom settings. A list of all your Subdomains can be found inside the `Properties` section of the service management page.

#### Redirect

This type allows you to redirect a previously configured subdomain to a newly configured one. This is useful if you want to change a subdomain name, but do not want to disrupt loading of an already published site.

Note that redirects can only be used for other subdomains, not external websites.

#### Web Page

This type allows you to configure a website's hosted folder.

1. First, upload the static files for your website to File Browser or to Nextcloud's "Files".
1. Then, select the service you uploaded to for internal data storage.
1. Finally, enter the path to the website folder. For example, I create a folder in File Browser called "websites", and another folder inside that one called "blog". Entering the path of websites/blog would tell Pages that it can find the blog files inside that path in File Browser.

**NOTE:** Folder Paths are case sensitive. Nextcloud folders are capitalized by default, so be sure to input them accordingly.
