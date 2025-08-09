'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, clearBag, loadGuestCart, addItemToCart } from '@/redux/features/bag-slice'
import { cartStorage } from '@/utils/cartStorage'

export default function CartHydration() {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  const prevSessionRef = useRef(session)
  const cartFetched = useRef(false)
  const guestCartLoaded = useRef(false)
  const cartMerged = useRef(false)
  
  // Get cart state
  const { items, loading } = useSelector((state) => state.bag)

  useEffect(() => {
    const prevSession = prevSessionRef.current
    
    if (status === 'loading') {
      // Don't do anything while auth status is loading
      return
    }
    
    if (status === 'authenticated' && session) {
      // User is logged in
      const userJustLoggedIn = !prevSession || prevSession.user.id !== session.user.id
      
      if (userJustLoggedIn && !cartFetched.current) {
        // User just logged in - need to handle cart merging
        const guestCartItems = items.length > 0 ? [...items] : []
        
        // Fetch user's server cart first
        cartFetched.current = true
        dispatch(fetchCart()).then((serverCartAction) => {
          // After server cart is loaded, merge with guest cart if any
          if (guestCartItems.length > 0 && !cartMerged.current) {
            cartMerged.current = true
            
            // Add each guest cart item to server cart
            guestCartItems.forEach(async (guestItem) => {
              try {
                await dispatch(addItemToCart(guestItem)).unwrap()
              } catch (error) {
                console.error('Error merging guest cart item:', error)
              }
            })
            
            // Clear guest cart from localStorage after successful merge
            cartStorage.clearGuestCart()
          }
        }).catch((error) => {
          console.error('Error fetching user cart:', error)
        })
      }
    } else if (status === 'unauthenticated') {
      // User is not logged in (guest)
      if (prevSession) {
        // User just logged out - clear cart and reset flags
        dispatch(clearBag())
        cartFetched.current = false
        cartMerged.current = false
        guestCartLoaded.current = false
        cartStorage.clearGuestCart()
      } else if (!guestCartLoaded.current && items.length === 0 && !loading) {
        // Initial load for guest user - load from localStorage
        guestCartLoaded.current = true
        if (cartStorage.hasGuestCart()) {
          dispatch(loadGuestCart())
        }
      }
    }
    
    prevSessionRef.current = session
  }, [session, status, dispatch, items.length, loading])

  return null // This component doesn't render anything
} 