import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // no-referrer: URL payment bawa orderToken (?t=) — jangan ikut terkirim ke domain lain (mis. redirect Snap)
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // dev webpack eval source-maps butuh 'unsafe-eval'; prod app code gak ada eval/new Function (pentest L1 — nonce buat 'unsafe-inline' masih defer)
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // iframe Google Maps di section Kunjungi kami (default-src 'self' memblokir frame eksternal)
      "frame-src 'self' https://www.google.com https://maps.google.com https://maps.google.co.id",
      "connect-src 'self' https://*.midtrans.com https://*.gopay.co.id",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/:path*",
        headers: [{ key: "X-Powered-By", value: "" }],
      },
    ];
  },
};

export default nextConfig;
