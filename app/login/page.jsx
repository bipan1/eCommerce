'use client'

import { Button, Card, Form, Input, Divider } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const { push } = useRouter()
  const loginSuccess = () => toast.success('Logged in Successfully')
  const loginFailure = () => toast.error("Invalid Credentials")
  const googleLoginFailure = () => toast.error("Google login failed")

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      push('/')
    }
  }, [status])

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await signIn('google', {
        credential: credentialResponse.credential,
        redirect: false,
        callbackUrl: '/'
      });

      if (res.error) {
        googleLoginFailure();
      } else {
        loginSuccess();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      googleLoginFailure();
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    googleLoginFailure();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border border-gray-100 rounded-3xl overflow-hidden p-8 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#2C7A7B] mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-lg">Sign in to your account to continue</p>
          </div>

          <div className="w-full flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
              theme="outline"
            />
          </div>

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
