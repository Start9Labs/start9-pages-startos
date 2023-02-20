# About

Start9 Pages provides a simple way to host custom websites over Tor. Your website could be a blog, a resume, a portfolio, a business landing page, a product brochure, or just a set of files that you want to share with the world.

Start9 Pages lets you host a homepage at its primary Tor URL, as well as any number of web pages on various subdomains. For example, one site could be `hello.xxxxxxxx.onion` and another could be `goodbye.xxxxxxxxx.onion`. What is served from the homepage and each subdomain is totally up to you.

# Instructions

## Homepage

Inside `Config`, you can easily change the behavior of your Homepage to serve:

   1. Welcome: A default welcome page
   1. Subdomain Index: A list of hyperlinks to all your subdomains
   1. Web Page: A personal web page
   1. Redirect: An automatic redirect to another subdomain

**NOTE:** Changing the homepage setting requires a hard refresh of the browser.

## Subdomains

Inside `Config`, you can create one or more subdomains, giving each a unique name and custom settings. A list of all your subdomains can be found inside the `Properties` section of the service management page.

### Redirect

This type allows you to redirect a previously configured subdomain to a newly configured one. This is useful if you want to change a subdomain name, but do not want to disrupt loading of an already published site.

Note that redirects can only be used for other subdomains, not external websites.

### Web Page

This type allows you to configure a website's hosted folder.

1. First, upload the files for your website to File Browser, or to Nextcloud's "Files".
1. Then, select the service you uploaded to for the folder location.
1. Finally, enter the path to the website folder. For example, you create a folder in File Browser called "websites", and another folder inside that one called "blog". Entering the path of websites/blog would tell Start9 Pages that it can find the blog files inside that path in File Browser.

**NOTE:** Folder Paths are case sensitive. Nextcloud folders are capitalized by default, so be sure to input them accordingly.
