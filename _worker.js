// Cloudflare Pages "advanced mode" worker. Its only job: 301 www.somosincontrol.com -> apex.
// _redirects cannot match a host, and the API token on tiny has no Redirect Rules scope.
// Everything else goes straight to the static assets (which still apply _redirects and 404.html).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.somosincontrol.com") {
      url.hostname = "somosincontrol.com";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
