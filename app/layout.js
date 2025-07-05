'use client'

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
import Head from 'next/head'
import { useEffect } from 'react'
import { store } from '@/redux/store'
import { fetchCategories } from '@/redux/features/category-slice'
import { fetchProducts } from '@/redux/features/products-slice'
import { NotificationProvider } from '../components/notification/NotificationProvider'

function RootLayoutContent({ children }) {
  useEffect(() => {
    store.dispatch(fetchCategories())
    store.dispatch(fetchProducts())
  }, [])

  return (
    <html lang="en">
      <body className="bg-[#FBFAF7]">
        <main>
          <AntdStyledComponentsRegistry>
            <ReduxProvider>
              <NextAuthProvider>
                <NotificationProvider>
                  <CartHydration />
                  <Header />
                  <div>{children}</div>
                  <Footer />
                  <Cart />
                  <MobileSidebar />
                  <div>
                    <Head>
                      <title>Himali Basket - Your Online Grocery Store</title>
                      <link
                        rel="icon"
                        type="image/svg+xml"
                        href="/logo-no-background.svg"
                      />
                    </Head>
                  </div>
                </NotificationProvider>
              </NextAuthProvider>
            </ReduxProvider>
          </AntdStyledComponentsRegistry>
        </main>
      </body>
    </html>
  )
}

export default function RootLayout({ children }) {
  return <RootLayoutContent>{children}</RootLayoutContent>
}
