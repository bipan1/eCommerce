'use client'

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Skeleton, Empty, Avatar, Divider } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { setProducts } from '@/redux/features/products-slice';
import { addItemToCart } from '@/redux/features/bag-slice';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useNotification } from '../notification/NotificationProvider';
import { axiosApiCall } from 'utils/axiosApiCall';
import { convertToFloat } from "utils";
import Slider from "react-slick";
import { FaArrowRight, FaPlus, FaMinus } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SpecialsSection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { specials = [] } = useSelector((state) => state.products);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [isMounted, setIsMounted] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [isAdding, setIsAdding] = useState({});

  // Helper function to calculate discount percentage
  const calculateDiscount = (price, specialPrice) => {
    const regularPrice = Number(price) || 0;
    const discountedPrice = Number(specialPrice) || 0;
    if (regularPrice === 0) return 0;
    return Math.round((1 - discountedPrice / regularPrice) * 100);
  };

  // Get quantity for a product (default to 1)
  const getQuantity = (productId) => quantities[productId] || 1;

  // Handle quantity changes
  const handleDecreaseCount = (e, productId) => {
    e.stopPropagation();
    const currentQuantity = getQuantity(productId);
    if (currentQuantity <= 1) return;
    setQuantities(prev => ({ ...prev, [productId]: currentQuantity - 1 }));
  };

  const handleIncreaseCount = (e, productId) => {
    e.stopPropagation();
    const currentQuantity = getQuantity(productId);
    setQuantities(prev => ({ ...prev, [productId]: currentQuantity + 1 }));
  };

  // Handle add to bag
  const handleAddToBag = async (e, product) => {
    e.stopPropagation();
    
    if (isAdding[product.id]) return; // Prevent double-clicking

    const quantity = getQuantity(product.id);
    const price = product.specialPrice || product.price;

    if (session) {
      // Logged-in user: use backend synchronization
      setIsAdding(prev => ({ ...prev, [product.id]: true }));
      try {
        await dispatch(addItemToCart({
          productId: product.id,
          quantity: quantity,
          price: price,
          image: product.image,
          name: product.name
        })).unwrap();
        
        showNotification('Item added to cart!', 'success');
        setQuantities(prev => ({ ...prev, [product.id]: 1 })); // Reset quantity after successful add
      } catch (error) {
        console.error('Error adding item to cart:', error);
        showNotification(error || 'Failed to add item to cart', 'error');
      } finally {
        setIsAdding(prev => ({ ...prev, [product.id]: false }));
      }
    } else {
      // Guest user: use local cart only
      dispatch(addItemToCart({
        productId: product.id,
        quantity: quantity,
        price: price,
        image: product.image,
        name: product.name
      }));
      showNotification('Item added to cart!', 'success');
      setQuantities(prev => ({ ...prev, [product.id]: 1 })); // Reset quantity after successful add
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 768) setSlidesToShow(2);
      else if (width < 1024) setSlidesToShow(3);
      else setSlidesToShow(4);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(specials.length, slidesToShow),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(specials.length, 3),
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(specials.length, 2),
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
        }
      }
    ]
  };

  if (!specials || specials.length === 0) {
    return null;
  }

  // Add console log to debug
  console.log('Specials count:', specials.length, 'Slides to show:', slidesToShow);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#2C7A7B]">
              Special Offers
            </h2>
            <div className="mt-2 text-lg text-[#4A5568]">
              Limited time deals on your favorite products
            </div>
          </div>
          <button
            onClick={() => router.push('/specials')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300"
          >
            View All Specials
            <FaArrowRight className="ml-2" />
          </button>
        </div>

        <div className="relative">
          {isMounted && specials.length > 0 && (
            <Slider {...sliderSettings} className="special-offers-slider">
              {specials.map((product) => (
                <div key={product.id} className="px-2 md:px-3">
                  <div 
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl 
                             transition-all duration-300 overflow-hidden h-full
                             border border-[#E2E8F0] hover:border-[#2C7A7B]
                             cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center 
                                 group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C7A7B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FC8181] text-white shadow-sm">
                          {calculateDiscount(product.price, product.specialPrice)}% OFF
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#2C7A7B] text-white shadow-sm">
                          Limited Time
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-base font-semibold text-[#2D3748] group-hover:text-[#2C7A7B] transition-colors duration-300 line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-bold text-[#FC8181]">
                          ${convertToFloat(product.specialPrice || 0)}
                        </span>
                        <span className="text-xs text-[#2C7A7B] line-through">
                          ${convertToFloat(product.price || 0)}
                        </span>
                      </div>

                      {/* Controls Container */}
                      <div className="space-y-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between border border-[#2C7A7B] rounded-lg overflow-hidden">
                          <button
                            onClick={(e) => handleDecreaseCount(e, product.id)}
                            className="flex-1 px-2 py-1.5 text-[#2C7A7B] hover:bg-[#E6FFFA] transition-colors duration-300"
                          >
                            <FaMinus className="w-3 h-3 mx-auto" />
                          </button>
                          <span className="flex-1 text-center py-1.5 text-[#2C7A7B] font-medium">
                            {getQuantity(product.id)}
                          </span>
                          <button
                            onClick={(e) => handleIncreaseCount(e, product.id)}
                            className="flex-1 px-2 py-1.5 text-[#2C7A7B] hover:bg-[#E6FFFA] transition-colors duration-300"
                          >
                            <FaPlus className="w-3 h-3 mx-auto" />
                          </button>
                        </div>

                        {/* Add to Bag Button */}
                        <button
                          onClick={(e) => handleAddToBag(e, product)}
                          disabled={session && isAdding[product.id]}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2C7A7B] 
                                   hover:bg-[#FC8181] text-white rounded-lg text-sm font-medium transition-all duration-300 
                                   shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <LuShoppingCart className="w-3.5 h-3.5" />
                          {(session && isAdding[product.id]) ? 'Adding...' : 'Add to Bag'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <style jsx global>{`
        .special-offers-slider .slick-prev,
        .special-offers-slider .slick-next {
          width: 30px;
          height: 30px;
          z-index: 1;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .special-offers-slider .slick-prev:hover,
        .special-offers-slider .slick-next:hover {
          background: #2C7A7B;
        }
        .special-offers-slider .slick-prev:hover:before,
        .special-offers-slider .slick-next:hover:before {
          color: white;
        }
        .special-offers-slider .slick-prev {
          left: -15px;
        }
        .special-offers-slider .slick-next {
          right: -15px;
        }
        .special-offers-slider .slick-prev:before,
        .special-offers-slider .slick-next:before {
          font-size: 20px;
          color: #2C7A7B;
          opacity: 1;
        }
        @media (max-width: 640px) {
          .special-offers-slider .slick-prev {
            left: 5px;
          }
          .special-offers-slider .slick-next {
            right: 5px;
          }
        }
      `}</style>
    </div>
  );
} 