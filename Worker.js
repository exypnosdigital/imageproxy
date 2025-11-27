export default {
  async fetch(request) {
    const url = new URL(request.url);
    const allowed_referers = ["domain.com", "example.com"];
    const redirect_to = "https://domain.com";

    // Reusable redirect function
    function redirectHome() {
      return Response.redirect(redirect_to, 302);
    }

    // --- Referer check ---
    const referer = request.headers.get("referer") || "";

    // Extract hostname from referer (safe)
    let refererHost = "";
    try {
      refererHost = new URL(referer).hostname;
    } catch (_) {
      return redirectHome();
    }

    if (!allowed_referers.includes(refererHost)) {
      return redirectHome();
    }

    // --- Safe Base64 decode for UTF‑8 ---
    const encoded = url.searchParams.get("url");
    if (!encoded) {
      return redirectHome();
    }

    let target;
    try {
      target = decodeURIComponent(escape(atob(encoded)));
    } catch (e) {
      return redirectHome();
    }

    if (!target) {
      return redirectHome();
    }

    let current = target;
    let response;

    // Follow redirects manually
    for (let i = 0; i < 5; i++) {
      response = await fetch(current, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const location = response.headers.get("Location");
      if (!location) break;

      current = new URL(location, current).toString();
    }

    const headers = new Headers(response.headers);
    const blacklist = [
      "set-cookie", "set-cookie2", "nel", "report-to",
      "priority", "server", "server-timing", "strict-transport-security"
    ];

    for (const key of [...headers.keys()]) {
      if (key.startsWith("x-") || blacklist.includes(key.toLowerCase())) {
        headers.delete(key);
      }
    }

    // --- Add safe headers ---
    headers.set("Server", "Image-Proxy-Worker");
    headers.set("Cache-Control", "public, max-age=86400");
    headers.set("Link", `<${current}>; rel="canonical"`);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    headers.set("Content-Location", current);
    headers.set("X-referer", referer);

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};
