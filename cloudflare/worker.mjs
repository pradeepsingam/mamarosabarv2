// Preserve the site's .html canonical URLs and handle redirects at Cloudflare.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const production = url.hostname === 'mamarosabar.ca' || url.hostname === 'www.mamarosabar.ca';
    if ((production && (url.protocol !== 'https:' || url.hostname.startsWith('www.'))) || url.pathname === '/index.html') {
      if (production) { url.protocol = 'https:'; url.hostname = 'mamarosabar.ca'; url.port = ''; }
      if (url.pathname === '/index.html') url.pathname = '/';
      return Response.redirect(url.toString(), 301);
    }
    // With html_handling:none, map only the root explicitly. Missing URLs stay 404.
    if (url.pathname === '/') url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  }
};
