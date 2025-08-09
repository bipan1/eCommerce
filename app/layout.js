import '../styles/global.css'
import Header from '../components/header'
import NextAuthProvider from '../providers/next-auth-provider'
import ReduxProvider from '../providers/redux-providers'
import Cart from '../components/cart'
import CartHydration from '../components/cart/CartHydration'
import GuestCartPersistence from '../components/cart/GuestCartPersistence'
import AntdStyledComponentsRegistry from '../components/antdStyleRegistry'
import Footer from 'components/footer'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import MobileSidebar from '../components/Sidebar/MobileSidebar'
import { NotificationProvider } from '../components/notification/NotificationProvider'
import DataInitializer from '../components/DataInitializer'

export const metadata = {
  title: 'Sathiko Kirana Pasal - Best Nepali Grocery Store in Melbourne | Authentic Nepali Groceries Online',
  description: 'Melbourne\'s premier Nepali grocery store. Fresh Nepali groceries, authentic spices, rice, lentils, and traditional ingredients delivered across Melbourne. Shop online for authentic Nepali groceries with fast delivery.',
  keywords: 'Nepali grocery store Melbourne, Nepali groceries online, Nepali spices Melbourne, Nepali grocery delivery Melbourne, Nepali food Melbourne, Nepali grocery store Melbourne, online grocery shopping Melbourne, Nepali ingredients Melbourne, Nepali spices Melbourne, grocery delivery Melbourne',
  authors: [{ name: 'Sathiko Kirana Pasal' }],
  creator: 'Sathiko Kirana Pasal',
  publisher: 'Sathiko Kirana Pasal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.sathikokirana.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sathiko Kirana Pasal - Best Nepali Grocery Store in Melbourne',
    description: 'Melbourne\'s premier Nepali grocery store. Fresh Nepali groceries, authentic spices, rice, lentils, and traditional ingredients delivered across Melbourne.',
    url: 'https://www.sathikokirana.com.au',
    siteName: 'Sathiko Kirana Pasal',
    images: [
      {
        url: '/headerfinal.png',
        width: 1200,
        height: 630,
        alt: 'Sathiko Kirana Pasal - Nepali Grocery Store Melbourne',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathiko Kirana Pasal - Best Nepali Grocery Store in Melbourne',
    description: 'Melbourne\'s premier Nepali grocery store. Fresh Nepali groceries, authentic spices, rice, lentils, and traditional ingredients delivered across Melbourne.',
    images: ['/headerfinal.png'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/headerfinal.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        url: '/headerfinal.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/headerfinal.png',
        sizes: '144x144',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=10" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=10" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=10" />
        <link rel="icon" type="image/png" sizes="48x48" href="/headerfinal.png?v=10" />
        <link rel="icon" type="image/png" sizes="96x96" href="/headerfinal.png?v=10" />
        <link rel="icon" type="image/png" sizes="144x144" href="/headerfinal.png?v=10" />
        <link rel="shortcut icon" href="/favicon.ico?v=10" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=10" />
        <link rel="apple-touch-icon" sizes="192x192" href="/android-chrome-192x192.png?v=10" />
        <link rel="apple-touch-icon" sizes="512x512" href="/android-chrome-512x512.png?v=10" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/headerfinal.png?v=9" />
        <meta name="msapplication-TileColor" content="#2C7A7B" />
        <meta name="theme-color" content="#2C7A7B" />
        
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        
        {/* Additional favicon formats for better browser support */}
        <link rel="icon" type="image/svg+xml" href="/headerfinal.png?v=9" />
        
        {/* Additional meta tags for better Google indexing */}
        <meta property="og:image" content="https://www.sathikokirana.com.au/headerfinal.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sathiko Kirana Pasal - Nepali Grocery Store Melbourne" />
        <meta name="twitter:image" content="https://www.sathikokirana.com.au/headerfinal.png" />
        <meta name="msapplication-TileColor" content="#2C7A7B" />
        <meta name="theme-color" content="#2C7A7B" />
        
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GroceryStore",
              "name": "Sathiko Kirana Pasal",
                             "description": "Melbourne's premier Nepali grocery store offering fresh Nepali groceries, authentic spices, rice, lentils, and traditional ingredients with fast delivery across Melbourne.",
              "url": "https://www.sathikokirana.com.au",
              "logo": "https://www.sathikokirana.com.au/headerfinal.png",
              "image": "https://www.sathikokirana.com.au/headerfinal.png",
              "telephone": "+61-XXX-XXX-XXX",
              "email": "info@sathikokirana.com.au",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Melbourne",
                "addressRegion": "VIC",
                "addressCountry": "AU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-37.8136",
                "longitude": "144.9631"
              },
              "openingHours": "Mo-Su 09:00-18:00",
              "priceRange": "$$",
                             "servesCuisine": ["Nepali", "South Asian"],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Nepali and Indian Groceries",
                                 "itemListElement": [
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "Product",
                       "name": "Nepali Spices"
                     }
                   },
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "Product",
                       "name": "Nepali Groceries"
                     }
                   },
                   {
                     "@type": "Offer",
                     "itemOffered": {
                       "@type": "Product",
                       "name": "Rice and Lentils"
                     }
                   }
                 ]
              },
              "sameAs": [
                "https://www.facebook.com/sathikokirana",
                "https://www.instagram.com/sathikokirana",
                "https://www.tiktok.com/@sathikokirana"
              ]
            })
          }}
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sathiko Kirana Pasal",
              "url": "https://www.sathikokirana.com.au",
              "logo": "https://www.sathikokirana.com.au/headerfinal.png",
                             "description": "Melbourne's premier Nepali grocery store offering authentic Nepali groceries with fast delivery.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Melbourne",
                "addressRegion": "VIC",
                "addressCountry": "AU"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+61-XXX-XXX-XXX",
                "contactType": "customer service",
                "areaServed": "AU",
                "availableLanguage": "English"
              }
            })
          }}
        />
      </head>
      <body className="bg-[#FBFAF7]">
        <main>
          <AntdStyledComponentsRegistry>
            <ReduxProvider>
              <NextAuthProvider>
                <NotificationProvider>
                  <DataInitializer />
                  <CartHydration />
                  <GuestCartPersistence />
                  <Header />
                  <div>{children}</div>
                  <Footer />
                  <Cart />
                  <MobileSidebar />
                </NotificationProvider>
              </NextAuthProvider>
            </ReduxProvider>
          </AntdStyledComponentsRegistry>
        </main>
      </body>
    </html>
  )
}
