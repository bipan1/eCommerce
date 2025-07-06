'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, clearBag } from '@/redux/features/bag-slice'

export default function CartHydration() {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  const prevSessionRef = useRef(session)
  const cartFetched = useRef(false)
  
  // Get cart state to check if we already have items
  const { items, loading } = useSelector((state) => state.bag)

  useEffect(() => {
    const prevSession = prevSessionRef.current
    
    if (status === 'authenticated' && session) {
      // If user just logged in, fetch their cart from backend
      // Only fetch if we haven't fetched before, don't have items, and not currently loading
      if ((!prevSession || prevSession.user.id !== session.user.id) && 
          !cartFetched.current && 
          items.length === 0 && 
          !loading) {
        cartFetched.current = true
        dispatch(fetchCart())
      }
    } else if (status === 'unauthenticated' && prevSession) {
      // If user just logged out, clear the cart and reset fetch flag
      dispatch(clearBag())
      cartFetched.current = false
    }
    
    prevSessionRef.current = session
  }, [session, status, dispatch, items.length, loading])

  return null // This component doesn't render anything
} 