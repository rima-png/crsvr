/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    // Bundle brand-font TTFs into the /api/generate-pdf serverless function so
    // @react-pdf can resolve them via path.join(process.cwd(), 'public', 'fonts').
    // Without this, Vercel only ships /public/ as static assets, not into the
    // function bundle, and the PDF route 500s on font lookup in production.
    outputFileTracingIncludes: {
      '/api/generate-pdf': ['./public/fonts/*.ttf'],
    },
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' https://teamed.global https://*.teamed.global",
        },
      ],
    },
  ],
}

module.exports = nextConfig
