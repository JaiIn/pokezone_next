import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PokéZone - Pokemon Pokedex',
  description: 'Complete Pokemon encyclopedia with detailed information, comparison tools, and fun games',
  keywords: ['pokemon', 'pokedex', 'nintendo', 'game', 'encyclopedia'],
  authors: [{ name: 'PokéZone Team' }],
  creator: 'PokéZone',
  publisher: 'PokéZone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pokezone.vercel.app'),
  openGraph: {
    title: 'PokéZone - Pokemon Pokedex',
    description: 'Complete Pokemon encyclopedia with detailed information, comparison tools, and fun games',
    url: 'https://pokezone.vercel.app',
    siteName: 'PokéZone',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PokéZone - Pokemon Pokedex',
    description: 'Complete Pokemon encyclopedia with detailed information, comparison tools, and fun games',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
