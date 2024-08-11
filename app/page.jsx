'use client'
import { fetchProducts } from "@/redux/features/products-slice";
import { fetchCategories } from "@/redux/features/category-slice";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from "components/products/productCard";
import ProductDisplay from "components/products/productDisplay";

export default function Home() {
  const dispatch = useDispatch();
  const { data: products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [])

  return <div>
    <div className='relative z-[10] overflow-hidden px-20 mx-20'>
      <div>
        <div className="mt-10 mx-auto flex gap-4 flex-wrap">
          {products.map(product => {
            return <div>
              <ProductDisplay product={product} />
            </div>
          })}
        </div>
      </div>
    </div>
  </div>
}
