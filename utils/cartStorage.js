// localStorage utilities for guest cart persistence
const GUEST_CART_KEY = 'sathiko_guest_cart'

export const cartStorage = {
  // Load guest cart from localStorage
  loadGuestCart: () => {
    if (typeof window === 'undefined') return { items: [], numberOfItems: 0 }
    
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          items: parsed.items || [],
          numberOfItems: parsed.numberOfItems || 0
        }
      }
    } catch (error) {
      console.error('Error loading guest cart from localStorage:', error)
    }
    
    return { items: [], numberOfItems: 0 }
  },

  // Save guest cart to localStorage
  saveGuestCart: (cartState) => {
    if (typeof window === 'undefined') return
    
    try {
      const dataToStore = {
        items: cartState.items,
        numberOfItems: cartState.numberOfItems,
        timestamp: Date.now()
      }
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(dataToStore))
    } catch (error) {
      console.error('Error saving guest cart to localStorage:', error)
    }
  },

  // Clear guest cart from localStorage
  clearGuestCart: () => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(GUEST_CART_KEY)
    } catch (error) {
      console.error('Error clearing guest cart from localStorage:', error)
    }
  },

  // Check if guest cart exists
  hasGuestCart: () => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(GUEST_CART_KEY) !== null
  }
} 