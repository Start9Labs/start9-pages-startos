# Embassy Pages

## About

Embassy Pages is a simple web server that uses directories inside File Browser to serve Tor websites. Your website could be a blog, a resume, a portfolio, a business landing page, a product brochure, or just a set of static folders and/or files that you want to share with the world.

When you first install Embassy Pages, there will be a default Homepage hosted at the root, <tor-address>.onion. You can change the behavior of this page, and you can also create Subdomain websites. For example, one site could be hello.<tor-address>.onion and another could be goodbye.<tor-address>.onion. What is served from the Homepage and each Subdomain is totally up to you.
   
Self-hosting Tor  websites using Embassy Pages is easy, permissionless, and censorship-resistant; there are no trusted third parties involved.
Anyone can do it. No one can stop it.

## Instructions

1. Inside Config, you can easily change the behavior of your Homepage to serve:
   1. A list of hyperlinks to all your Subdomains
   1. A personal web page
   1. An automatic redirect to a Subdomain
   1. A static web page that tells anyone visiting it to fuck off, politely.
   
1. Inside Config, you can create one or more Subdomains, giving each a unique name.

1. To serve a personal website, simply upload the website directory to File Browser. Then, inside the settings for a particular page (either your Homepage or a Subdomain), enter the path to that directory. For example, a path of websites/blog would tell Embassy Pages that it can find the blog website inside the websites directory in File Browser.

1. A list of all your Subdomains can be found inside the Properties section of your Embassy Pages service.
