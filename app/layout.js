import '../styles/global.css'
import Header from '../components/header'
import NextAuthProvider from '../providers/next-auth-provider'
import ReduxProvider from '../providers/redux-providers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cart from '../components/cart'
import Spinner from '../components/spinner'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <main>
          <ReduxProvider>
            <NextAuthProvider>
              <ToastContainer autoClose={3000} hideProgressBar={true} />
              <Header />
              <Spinner />
              <div className="mt-20">{children}</div>
              <Cart />
            </NextAuthProvider>
          </ReduxProvider>
        </main>
      </body>
    </html>
  )
}
