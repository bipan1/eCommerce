import Header from '@/components/header'
import './globals.css'
import NextAuthProvider from '@/providers/next-auth-provider'
import ReduxProvider from '@/providers/redux-providers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <NextAuthProvider>
            <ToastContainer autoClose={3000} hideProgressBar={true} />
            <Header />
            <div className='mt-20'>
              {children}
            </div>
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}


