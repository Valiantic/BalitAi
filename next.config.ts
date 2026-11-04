import type { NextConfig } from "next";

// shortcut: 'unsafe-inline' scripts are needed for Next's inline hydration on a static page, so this
// does not stop inline XSS; upgrade to per-request nonces (middleware + dynamic rendering) if the site starts rendering untrusted HTML.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // https: covers OSM tiles, Leaflet markers and images from any RSS feed
  "img-src 'self' data: blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Production only: next dev needs eval and websockets, which this policy disallows.
if (process.env.NODE_ENV === "production") {
  // Report-only first, per the audit. To enforce, rename the key to Content-Security-Policy.
  securityHeaders.push({ key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy });
}

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
