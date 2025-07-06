import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import '@/components/MobileResponsive.css'
import CustomCursor from '@/components/CustomCursor'
import NoiseOverlay from '@/components/NoiseOverlay'
import NavigationOrb from '@/components/NavigationOrb'
import Header from '@/components/Header'
import GlobalParticles from '@/components/GlobalParticles'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Click2leads - UK\'s #1 Lead Generation Agency Since 2018',
  description: 'We\'ve generated 4.7M+ leads and spent £28M+ on digital advertising. Revenue share and pay per lead models available. If you win, we win.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-electric-blue text-white px-4 py-2 rounded-lg z-50"
          >
            Skip to main content
          </a>
          <GlobalParticles />
          <NoiseOverlay />
          <CustomCursor />
          <Header />
          <NavigationOrb />
          <main id="main-content" className="relative z-10 pt-16">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
}