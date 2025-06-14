'use client'

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaShoppingBag, FaTshirt, FaMobileAlt, FaLaptop, FaHome, FaUtensils, FaBook, FaGamepad, FaHeartbeat, FaCar } from 'react-icons/fa';
import { GiJewelCrown, GiLipstick, GiRunningShoe, GiSunglasses, GiWatch, GiFruitBowl, GiMeat, GiMilkCarton, GiCannedFood, GiBread } from 'react-icons/gi';
import { MdSportsSoccer, MdToys, MdPets, MdLocalDrink, MdLocalCafe, MdLocalDining, MdLocalGroceryStore } from 'react-icons/md';
import { BsLightningCharge, BsStar, BsClock, BsBasket, BsBasketFill } from 'react-icons/bs';
import React from 'react';

const categoryIcons = {
  'Fashion': FaTshirt,
  'Electronics': FaMobileAlt,
  'Computers': FaLaptop,
  'Home & Living': FaHome,
  'Beauty': GiLipstick,
  'Sports': MdSportsSoccer,
  'Books': FaBook,
  'Toys': MdToys,
  'Health': FaHeartbeat,
  'Automotive': FaCar,
  'Jewelry': GiJewelCrown,
  'Shoes': GiRunningShoe,
  'Accessories': GiSunglasses,
  'Watches': GiWatch,
  'Gaming': FaGamepad,
  'Pet Supplies': MdPets,
  'Groceries': FaUtensils,
  'Fruits': GiFruitBowl,
  'Vegetables': GiFruitBowl,
  'Meat': GiMeat,
  'Dairy': GiMilkCarton,
  'Canned Goods': GiCannedFood,
  'Bakery': GiBread,
  'Beverages': MdLocalDrink,
  'Coffee & Tea': MdLocalCafe,
  'Snacks': MdLocalDining,
  'Rice': BsBasketFill,
  'Spices': MdLocalGroceryStore,
  'default': FaShoppingBag
};

export default function FeaturedCategories() {
  const router = useRouter();
  const { data: categories } = useSelector((state) => state.category);

  const featuredCategories = categories?.slice(0, 6) || []; // Show only first 6 categories

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2C7A7B]">
            Shop by Category
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FC8181] rounded-full mx-auto"></div>
          <p className="mt-4 text-lg text-[#4A5568]">
            Find everything you need in our wide range of categories
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {featuredCategories.map((category) => {
            const Icon = categoryIcons[category.name] || categoryIcons.default;
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/products/categories/${category.id}`)}
                className="group bg-white rounded-xl p-4 sm:p-6 text-center cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#E2E8F0] hover:border-[#2C7A7B]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#E6FFFA] flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#2C7A7B] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#2D3748] group-hover:text-[#2C7A7B] transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4A5568] group-hover:text-[#38B2AC] transition-colors duration-300">
                  {category.description || 'Shop Now'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 