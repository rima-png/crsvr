import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'

// Brand fonts — General Sans (headings) + Instrument Sans (body) per
// https://teamed-website-platform.vercel.app/brand-kit. Files self-hosted from
// /public/fonts so we control delivery and they ship in the same edge cache.
const generalSans = localFont({
  src: [
    { path: '../../public/fonts/GeneralSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/GeneralSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/GeneralSans-Semibold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/GeneralSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
})

const instrumentSans = localFont({
  src: [
    { path: '../../public/fonts/InstrumentSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/InstrumentSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/InstrumentSans-Semibold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/InstrumentSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EOR vs Entity Crossover Calculator | Teamed',
  description: 'Calculate when it makes sense to switch from EOR to your own entity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className={`${generalSans.variable} ${instrumentSans.variable}`}>
      <body className="bg-grey-light min-h-screen font-sans antialiased">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  )
}
