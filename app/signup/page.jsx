'use client'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { axiosApiCall } from 'utils/axiosApiCall'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await signIn('google', {
        credential: credentialResponse.credential,
        redirect: false,
        callbackUrl: '/'
      });

      if (res.error) {
        googleSignupFailure();
      } else {
        createSuccess(); // Or a more specific message like 'Signed up with Google successfully!'
      }
    } catch (error) {
      console.error("Google sign-up error:", error);
      googleSignupFailure();
    }
  };

  const handleGoogleError = () => {
    console.log('Google Sign Up Failed');
    googleSignupFailure();
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
              theme="outline"
            />
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
