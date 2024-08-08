'use client'
import { fetchProducts } from "@/redux/features/products-slice";
import { fetchCategories } from "@/redux/features/category-slice";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [])

  return <div>
    <div className='relative z-[10] overflow-hidden px-20 mx-20'>
    </div>
  </div>
}
