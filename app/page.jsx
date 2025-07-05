'use client'

import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import SpecialsSection from '@/components/home/SpecialsSection';
import ProductDisplay from "components/products/productDisplay";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  const { data: products } = useSelector((state) => state.products);
  const { data: categories } = useSelector((state) => state.category);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastShownRef = useRef({ signup: false, login: false });

  // Check for signup/login success parameters
  useEffect(() => {
    const signupParam = searchParams.get('signup');
    const loginParam = searchParams.get('login');
    
    if (signupParam === 'success' && !toastShownRef.current.signup) {
      toast.success('Account created successfully.');
      toastShownRef.current.signup = true;
      // Clean up URL by removing the signup parameter
      const url = new URL(window.location);
      url.searchParams.delete('signup');
      window.history.replaceState({}, '', url.pathname);
    } else if (loginParam === 'success' && !toastShownRef.current.login) {
      toast.success('Logged in Successfully');
      toastShownRef.current.login = true;
      // Clean up URL by removing the login parameter
      const url = new URL(window.location);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams]);

  const categoryProductsMap = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(product => product.categoryId === category.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <HeroCarousel />
      
      <FeaturedCategories />
      
      <SpecialsSection />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map(cat => (
            <div key={cat.id} className="mb-12">
              {categoryProductsMap[cat.id]?.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {cat.name}
                      </h2>
                      <div className="mt-2 text-lg text-gray-600">
                        Browse our selection of {cat.name.toLowerCase()}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/products/categories/${cat.id}`)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#023020] hover:text-[#034d35] transition-colors duration-300"
                    >
                      View All
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {categoryProductsMap[cat.id].slice(0, 5).map(product => (
                      <div key={product.id}>
                        <ProductDisplay product={product} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
