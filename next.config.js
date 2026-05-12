/**
 * basePath ('/tools/crossover') so the tool can be served at
 * `teamed.global/tools/crossover/*` via a Next.js rewrite in the new Teamed
 * site (also Vercel-hosted). All internal <Link> + router navigation gets
 * auto-prefixed. Raw fetch('/api/...') calls are prefixed manually in the
 * consumer files. The standalone deploy now serves at
 * `crso-cal.vercel.app/tools/crossover/...` (the bare `/` returns 404 by
 * design; the tool will never be hit at the bare URL once embedded).
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/tools/crossover',
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    // Bundle brand-font TTFs into the /tools/crossover/api/generate-pdf
    // serverless function so @react-pdf can resolve them via
    // path.join(process.cwd(), 'public', 'fonts'). Without this, Vercel only
    // ships /public/ as static assets, not into the function bundle, and the
    // PDF route 500s on font lookup in production.
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
  /**
   * Bare-URL forwarder: `crso-cal.vercel.app/` would otherwise 404 because
   * `basePath` mounts the app under `/tools/crossover`. Send the root to
   * the tool so old links / typed URLs land in the right place.
   * `basePath: false` is essential — without it, the source `/` is
   * interpreted as `/tools/crossover/` (already the tool) and the
   * redirect never fires.
   */
  redirects: async () => [
    {
      source: '/',
      destination: '/tools/crossover',
      permanent: false,
      basePath: false,
    },
  ],
}

module.exports = nextConfig
