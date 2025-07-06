import '../styles/global.css'
import Header from '../components/header'
import NextAuthProvider from '../providers/next-auth-provider'
import ReduxProvider from '../providers/redux-providers'
import Cart from '../components/cart'
import CartHydration from '../components/cart/CartHydration'
import AntdStyledComponentsRegistry from '../components/antdStyleRegistry'
import Footer from 'components/footer'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import MobileSidebar from '../components/Sidebar/MobileSidebar'
import { NotificationProvider } from '../components/notification/NotificationProvider'
import DataInitializer from '../components/DataInitializer'

export const metadata = {
  title: 'Sathiko Pasal - Online Grocery Store',
  description: 'Your trusted online grocery store in Nepal',
  icons: {
    icon: [
      {
        url: '/logoheader.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        url: '/logoheader.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        url: '/logoheader.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/logoheader.png',
        sizes: '144x144',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/logoheader.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logoheader.png?v=5" type="image/png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/logoheader.png?v=5" />
        <link rel="icon" type="image/png" sizes="96x96" href="/logoheader.png?v=5" />
        <link rel="icon" type="image/png" sizes="144x144" href="/logoheader.png?v=5" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logoheader.png?v=5" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/logoheader.png?v=5" />
        <meta name="msapplication-TileColor" content="#2C7A7B" />
        <meta name="theme-color" content="#2C7A7B" />
      </head>
      <body className="bg-[#FBFAF7]">
        <main>
          <AntdStyledComponentsRegistry>
            <ReduxProvider>
              <NextAuthProvider>
                <NotificationProvider>
                  <DataInitializer />
                  <CartHydration />
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
