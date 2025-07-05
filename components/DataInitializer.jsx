'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCategories } from '@/redux/features/category-slice'
import { fetchProducts } from '@/redux/features/products-slice'

export default function DataInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  return null // This component doesn't render anything
} 