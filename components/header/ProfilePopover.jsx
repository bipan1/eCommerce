'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { BsPerson, BsBoxSeam, BsGear, BsShield } from 'react-icons/bs'
import AccountSettings from './AccountSettings'

export default function ProfilePopover({ isOpen, onClose, triggerRef }) {
  const { data: session } = useSession()
  const router = useRouter()
  const popoverRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on a link inside the popover
      if (event.target.closest('a')) {
        return
      }
      
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      // Small delay to show animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleNavigation = (path) => {
    console.log('Navigating to:', path)
    onClose()
    // Add a small delay to ensure popover closes before navigation
    setTimeout(() => {
      try {
        router.push(path)
      } catch (error) {
        console.log('Router failed, using window.location')
        window.location.href = path
      }
    }, 100)
  }

  const handleLogout = () => {
    console.log('Logging out')
    onClose()
    
    // Check if user is on a protected route that needs redirect to home
    const protectedRoutes = ['/myorders', '/account', '/admin']
    const currentPath = window.location.pathname
    const isOnProtectedRoute = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    )
    
    if (isOnProtectedRoute) {
      signOut({ callbackUrl: window.location.origin })
    } else {
      signOut()
    }
  }

  return (
    <div
      ref={popoverRef}
      className={`
        absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50
        transform transition-all duration-200 ease-out
        ${isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2'
        }
        ${isMobile ? 'right-0' : 'right-0'}
        ${session ? 'w-64' : 'w-44'}
      `}
      style={{
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}
    >
      {session ? (
        <div className="p-4">
          {/* User Info */}
          <div className="pb-3 mb-3 border-b border-gray-100">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="text-sm font-semibold text-[#2C7A7B]">{session.user.name}</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleNavigation('/account')
              }}
              className="w-full flex items-center gap-3 text-gray-700 hover:text-[#2C7A7B] p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
            >
              <BsPerson className="text-lg group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">My Profile</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleNavigation('/myorders')
              }}
              className="w-full flex items-center gap-3 text-gray-700 hover:text-[#2C7A7B] p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
            >
              <BsBoxSeam className="text-lg group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">My Orders</span>
            </button>



            {session?.user?.isAdmin && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleNavigation('/admin/category')
                }}
                className="w-full flex items-center gap-3 text-gray-700 hover:text-[#2C7A7B] p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
              >
                <BsGear className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Admin Dashboard</span>
              </button>
            )}

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLogout()
                }}
                className="w-full flex items-center gap-3 text-gray-700 hover:text-[#FC8181] p-3 rounded-lg hover:bg-red-50 transition-all duration-200 group"
              >
                <BsShield className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <AccountSettings onClose={onClose} />
      )}
    </div>
  )
} 