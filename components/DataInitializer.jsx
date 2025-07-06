'use client'

import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '@/redux/features/category-slice'
import { fetchProducts } from '@/redux/features/products-slice'

export default function DataInitializer() {
  const dispatch = useDispatch()
  const fetchAttempted = useRef({ categories: false, products: false })
  
  // Get current state of products and categories
  const { data: products, loading: productsLoading } = useSelector((state) => state.products)
  const { data: categories, loading: categoriesLoading } = useSelector((state) => state.category)

  useEffect(() => {
    // Only fetch categories if we don't have them, not already loading, and haven't attempted yet
    if (categories.length === 0 && !categoriesLoading && !fetchAttempted.current.categories) {
      fetchAttempted.current.categories = true
      dispatch(fetchCategories())
    }
    
    // Only fetch products if we don't have them, not already loading, and haven't attempted yet
    if (products.length === 0 && !productsLoading && !fetchAttempted.current.products) {
      fetchAttempted.current.products = true
      dispatch(fetchProducts())
    }
  }, [dispatch, categories.length, products.length, categoriesLoading, productsLoading])

  return null // This component doesn't render anything
} 