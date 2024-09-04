import '../styles/global.css'
import Header from '../components/header'
import NextAuthProvider from '../providers/next-auth-provider'
import ReduxProvider from '../providers/redux-providers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cart from '../components/cart'
import AntdStyledComponentsRegistry from '../components/antdStyleRegistry'
import Footer from 'components/footer'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import MobileSidebar from '../components/Sidebar/MobileSidebar'
import Head from 'next/head'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FBFAF7]">
        <main>
          <AntdStyledComponentsRegistry>
            <ReduxProvider>
              <NextAuthProvider>
                <ToastContainer
                  position="bottom-right"
                  autoClose={1500}
                  hideProgressBar={true}
                />
                <Header />
                <div>{children}</div>
                <Footer />
                <Cart />
                <MobileSidebar />
                <div>
                  <Head>
                    <title>Best Nepalese Grocery</title>
                    <link
                      rel="icon"
                      type="image/svg+xml"
                      href="/logo-no-background.svg"
                    />
                  </Head>
                </div>
              </NextAuthProvider>
            </ReduxProvider>
          </AntdStyledComponentsRegistry>
        </main>
      </body>
    </html>
  )
}
