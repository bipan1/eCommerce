'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSelector, useDispatch } from 'react-redux'
import { saveGuestCart } from '@/redux/features/bag-slice'

export default function GuestCartPersistence() {
  const { status } = useSession()
  const dispatch = useDispatch()
  const { items, numberOfItems } = useSelector((state) => state.bag)

  // Auto-save to localStorage when cart changes for guest users
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Save guest cart to localStorage whenever cart state changes
      dispatch(saveGuestCart())
    }
  }, [items, numberOfItems, status, dispatch])

  return null // This component doesn't render anything
} 