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
  title: 'Sathiko Pasal - Your Online Grocery Store',
  description: 'Your trusted online grocery store in Nepal',
  icons: {
    icon: '/logoheader.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
