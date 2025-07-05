'use client'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { axiosApiCall } from 'utils/axiosApiCall'
import { useRouter } from 'next/navigation'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  
  const createSuccess = () => toast.success('Account created successfully.')
  const duplicateEmail = () => toast.error("Email already exists in the system.")
  const googleSignupFailure = () => toast.error("Google signup failed")
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please input your full name!'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters!'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Please input your email!'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email!'
    }
    
    if (!formData.password) {
      newErrors.password = 'Please input your password!'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted with values:', formData)
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true);

    try {
      await axiosApiCall('/user/create', 'POST', formData);
      setLoading(false)
      createSuccess();
      router.push('/login');
    } catch (e) {
      if (e.code == "ERR_BAD_REQUEST") {
        duplicateEmail();
      }
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Use redirect: true for proper OAuth flow
      // Toast will be handled by the home page after redirect
      await signIn('google', {
        callbackUrl: '/?signup=success',
        redirect: true
      });
    } catch (error) {
      console.error("Google sign-up error:", error);
      googleSignupFailure();
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="shadow-2xl border border-gray-100 rounded-3xl overflow-hidden p-8 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#2C7A7B] mb-2">Create Account</h2>
            <p className="text-gray-500 text-lg">Join us to start shopping</p>
          </div>

          <div className="w-full flex justify-center mb-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400 font-medium">or sign up with email</span>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className={`w-full h-12 pl-12 pr-4 rounded-lg border-2 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#2C7A7B] focus:ring-4 focus:ring-[#E6FFFA]'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <MailOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                    className={`w-full h-12 pl-12 pr-4 rounded-lg border-2 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#2C7A7B] focus:ring-4 focus:ring-[#E6FFFA]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <LockOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className={`w-full h-12 pl-12 pr-4 rounded-lg border-2 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#2C7A7B] focus:ring-4 focus:ring-[#E6FFFA]'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center text-base text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-[#2C7A7B] hover:text-[#FC8181] font-semibold transition-colors duration-300"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
