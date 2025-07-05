'use client'

import { Button, Card, Form, Input, Divider } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import Image from 'next/image'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [form] = Form.useForm()

  const { push } = useRouter()
  const searchParams = useSearchParams()
  const loginSuccess = () => toast.success('Logged in Successfully')
  const loginFailure = () => toast.error("Invalid Credentials")
  const googleLoginFailure = () => toast.error("Google login failed")
  const oauthAccountNotLinked = () => toast.error("This email is already registered with a different login method. Please use your email and password to sign in.")

  const { status } = useSession()

  useEffect(() => {
    // Only redirect if authenticated and no OAuth error parameters present
    if (status === 'authenticated' && !searchParams.get('error') && !searchParams.get('code')) {
      push('/')
    }
  }, [status, searchParams])

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'OAuthAccountNotLinked') {
      oauthAccountNotLinked()
      // Clean up URL by removing error parameter
      const url = new URL(window.location)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url)
    } else if (error === 'Callback') {
      toast.error("OAuth callback error. Please check your Google OAuth configuration.")
      // Clean up URL by removing error parameter
      const url = new URL(window.location)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url)
    }
  }, [searchParams])

  const handleSubmit = async (values) => {
    console.log('Form submitted with values:', values)
    setLoading(true)
    const { email, password } = values

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('SignIn response:', res)

      if (res.error) {
        if (res.status === 401) {
          loginFailure();
        }
      } else {
        loginSuccess();
      }
      setLoading(false)
    } catch (err) {
      console.error('SignIn error:', err)
      loginFailure()
      setLoading(false)
    }
  }

  const handleSubmitFailed = (errorInfo) => {
    console.log('Form submission failed:', errorInfo)
  }

  const handleButtonClick = () => {
    console.log('Button clicked, attempting form submission')
    form.submit()
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      // Use redirect: true for proper OAuth flow
      // Toast will be handled by the home page after redirect
      await signIn('google', {
        callbackUrl: '/?login=success',
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      googleLoginFailure();
      setGoogleLoading(false)
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border border-gray-100 rounded-3xl overflow-hidden p-8 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#2C7A7B] mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-lg">Sign in to your account to continue</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mb-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 hover:border-gray-300"
          >
            {googleLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in with Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <Divider className="my-6 text-gray-400 font-medium text-sm">or sign in with email</Divider>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const values = {
                email: formData.get('email'),
                password: formData.get('password')
              };
              console.log('HTML form submitted:', values);
              handleSubmit(values);
            }}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <MailOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-gray-200 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-[#2C7A7B] focus:ring-4 focus:ring-[#E6FFFA] focus:outline-none hover:border-gray-300"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <LockOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-gray-200 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-[#2C7A7B] focus:ring-4 focus:ring-[#E6FFFA] focus:outline-none hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] hover:from-[#FC8181] hover:to-[#F687B3] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center text-base text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => push('/signup')}
              className="text-[#2C7A7B] hover:text-[#FC8181] font-semibold transition-colors duration-300"
            >
              Sign up
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
