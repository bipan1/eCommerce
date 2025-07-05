'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { fetchCart, clearBag } from '@/redux/features/bag-slice'

export default function CartHydration() {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  const prevSessionRef = useRef(session)

  useEffect(() => {
    const prevSession = prevSessionRef.current
    
    if (status === 'authenticated' && session) {
      // If user just logged in, fetch their cart from backend
      if (!prevSession || prevSession.user.id !== session.user.id) {
        dispatch(fetchCart())
      }
    } else if (status === 'unauthenticated' && prevSession) {
      // If user just logged out, clear the cart
      dispatch(clearBag())
    }
    
    prevSessionRef.current = session
  }, [session, status, dispatch])

  return null // This component doesn't render anything
} 