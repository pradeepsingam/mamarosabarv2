# Mama Rosa deployment

Production URL: https://mamarosabar.ca/
Canonical pages: /, /menu.html, /contact.html.

## Local preview

From this folder, run `php -S 127.0.0.1:8000 router.php`.
The router redirects /index.html to / and returns a real 404 for missing paths.

## Cloudflare Workers (Git-connected build)

The repository includes wrangler.jsonc and a pinned Wrangler dependency.
Use these dashboard settings:

- Project/Worker name: mamarosabarv2
- Production branch: main
- Build command: npm run build
- Deploy command: npx wrangler deploy
- Root directory: repository root

The build copies only the public HTML, robots.txt, sitemap.xml and assets into
dist/. Git data, PHP, deployment notes and build tools are never included.
The build validates every public file against Cloudflare's 25 MiB asset limit.
Keep assets.directory set to ./dist; do not change it to the repository root.

Wrangler's custom build command also supports running npx wrangler deploy or
npm run dev locally. Set the explicit build command in Workers Builds: its
pipeline does not rely on Wrangler's custom-build configuration.

Cloudflare runs cloudflare/worker.mjs for root mapping, HTTPS/apex redirects,
and /index.html consolidation. HTML handling is set to none so /menu.html and
/contact.html retain their canonical paths. Unknown paths use 404.html with a
404 response. Preview workers.dev addresses remain usable. Add the custom
production domain in Cloudflare after a successful deployment.

Validate with npm run test:cloudflare and npx wrangler deploy --dry-run.
No Cloudflare account identifiers, domain bindings or credentials are stored in
the repository; creating a build does not itself attach the production domain.

## Apache 2.4

Publish the site and assets, including .htaccess, robots.txt, sitemap.xml and
404.html. Enable mod_rewrite and AllowOverride FileInfo Options for the site.
The .htaccess file uses HTTPS apex redirects and an explicit index.html redirect;
it does not rewrite unknown paths to the homepage. The Apache rules have not
been exercised against a production server in this task.

Configure a TLS certificate for mamarosabar.ca and www.mamarosabar.ca before
checking redirects. Behind a TLS-terminating reverse proxy, have the hosting
provider make HTTPS detection accurate at the origin or configure the redirect
at the proxy; the supplied rules assume Apache sees the actual HTTPS connection.
Do not publish the Git checkout metadata or development scripts/router as site
content. Static hosting is supported if equivalent redirects and error handling
are configured in that host; .htaccess is Apache-specific.

## Other hosts

Configure equivalent behavior in the host's routing settings:
- HTTP apex and HTTP/HTTPS www -> HTTPS apex, preserving path and query.
- /index.html -> /; ideally combine this with host/protocol redirects.
- Serve /menu.html, /contact.html, assets, robots.txt and sitemap.xml directly.
- Return HTTP 404 with 404.html for missing URLs; do not enable an SPA fallback.

## Launch verification

- Check all three canonical pages return HTTP 200 on the final HTTPS domain.
- Test HTTP, www and index.html redirects on the actual host.
- Check a made-up path returns 404.
- Confirm robots.txt is plain text and sitemap.xml is XML with the three
  production canonical URLs.
- Check canonical, Open Graph and JSON-LD URLs resolve publicly.
- Validate Restaurant/Breadcrumb markup with Google's Rich Results Test and
  inspect the live URLs in the owner's Search Console property.
- Submit the sitemap through that property after deployment.
- Measure mobile page loading and interactions; the local source checks do not
  establish field LCP, INP or CLS.

Opening hours are in content.md and repeated visibly and in JSON-LD on the
three pages. Reservations call the restaurant; only ordering opens Sharaly.
No unsupported postal code, coordinates, review count or rating was added.
