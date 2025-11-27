Image Proxy Worker
==================

A privacy‑focused Cloudflare Worker that safely proxies external images, strips cookies and tracking headers, prevents third‑party servers from collecting user data, and ensures full GDPR compliance.

This Worker is ideal when you **do not host the images yourself**, but must display them without exposing your users to tracking, cookies, or external data collection.

* * *

### The GDPR Problem With External Images

When your website loads images directly from external sources, those servers can silently send:

*   tracking cookies
*   analytics identifiers
*   fingerprinting headers
*   redirect‑based tracking
*   metadata exposing server technologies

Because you don’t control these external servers, you **cannot prevent them** from attaching such data to the image response.

### ⚠️ GDPR Risk

Under GDPR, **any cookie or user‑identifiable data** must be collected only with explicit consent.  
However, many image hosts drop cookies automatically — even for simple GET requests.

This means:

> If you embed images from third‑party servers that set cookies, **your website becomes non‑compliant**, even if it was unintentional.

* * *

🛡️ What the Worker Solves
--------------------------

This Worker acts as a **secure privacy buffer** between your visitors and external image hosts.

### It ensures:

*   Users never connect to the external server directly
*   External servers cannot set **any** cookies
*   External servers cannot track or fingerprint users
*   Your site remains **GDPR‑compliant**
*   The response is sanitized and safe
*   You control cache behavior, SEO headers, and metadata

### ✔️ GDPR Benefit

**This Worker prevents external servers from setting cookies or collecting user data, ensuring the images you serve remain privacy‑safe.**

* * *

✨ Key Features
--------------

*   **Allowed referer list** (`allowed_referers`)
*   **Reusable redirect function**
*   **Base64-safe UTF‑8 decoding**
*   **Manual redirect following** (max 5 hops)
*   **Complete cookie removal**
*   **Removes all x‑headers and tracking headers**
*   **Removes server fingerprinting headers**
*   **Adds safe caching and SEO headers**
*   Ensures all image requests are served cleanly from **your domain**

```text
┌────────────────────────┐
│  User's Browser        │
│  (requests image)      │
└───────────┬────────────┘
            │
            │ 1. GET /proxy?url=<base64>
            │    + sends Referer header
            ▼
┌────────────────────────────────┐
│ Cloudflare Worker (Proxy)      │
└───────────┬────────────────────┘
            │
            │ 2. Validate Referer
            │      └─ if NOT allowed → redirect to homepage
            │
            │ 3. Decode Base64 URL
            │      └─ if invalid → redirect to homepage
            │
            │ 4. Follow up to 5 redirects manually
            ▼
┌────────────────────────────────┐
│ External Image Server          │
│ (actual image host)            │
└───────────┬────────────────────┘
            │
            │ 5. Sends raw response:
            │      - cookies
            │      - tracking headers
            │      - x-* fingerprinting
            │      - server metadata
            ▼
┌────────────────────────────────┐
│ Cloudflare Worker (Sanitizer)  │
└───────────┬────────────────────┘
            │
            │ 6. Strip dangerous headers:
            │      - set-cookie, set-cookie2
            │      - x-* headers
            │      - server, server-timing
            │      - nel, report-to, hsts
            │
            │ 7. Add safe headers:
            │      - Cache-Control
            │      - Link (canonical)
            │      - X-Robots-Tag
            │      - Content-Location
            ▼
┌────────────────────────┐
│  User's Browser        │
│  receives CLEAN image  │
│  with:                 │
│    - NO cookies        │
│    - NO tracking       │
│    - NO server info    │
│    - GDPR-safe         │
└────────────────────────┘
```
