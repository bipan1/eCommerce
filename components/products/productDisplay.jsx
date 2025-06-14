'use client';
import { Button } from "antd";
import { useState } from "react";
import { FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { addItem } from '@/redux/features/bag-slice';
import { useDispatch } from 'react-redux';
import { convertToFloat } from "utils";
import { useRouter } from "next/navigation";

export default function ProductDisplay({ product }) {
    const [count, setCount] = useState(1);
    const [isWishlist, setIsWishlist] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleDecreaseCount = (e) => {
        e.stopPropagation();
        if (count <= 1) return;
        setCount(count - 1);
    }

    const handleIncreaseCount = (e) => {
        e.stopPropagation();
        setCount(count + 1);
    }

    const handleAddToBag = (e) => {
        e.stopPropagation();
        dispatch(addItem({
            productId: product.id,
            quantity: count,
            price: product.price,
            image: product.image,
            name: product.name
        }));
    }

    const handleCardClick = (e) => {
        e.preventDefault();
        router.push(`/products/${product.id}`)
    }

    const toggleWishlist = (e) => {
        e.stopPropagation();
        setIsWishlist(!isWishlist);
    }

    return (
        <div 
            onClick={handleCardClick}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl 
                     transition-all duration-300 overflow-hidden h-full 
                     border border-[#E2E8F0] hover:border-[#2C7A7B]
                     cursor-pointer"
        >
            {/* Product Image Container */}
            <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C7A7B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {product.isSpecial && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#2C7A7B] text-white shadow-sm">
                            Special Offer
                        </span>
                    )}
                    {product.outofStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FC8181] text-white shadow-sm">
                            Out of stock
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm 
                             hover:bg-[#2C7A7B] transition-all duration-300 shadow-sm transform hover:scale-110"
                >
                    <FaHeart className={`w-3.5 h-3.5 ${isWishlist ? 'text-[#FC8181]' : 'text-[#2C7A7B]'} 
                                      transition-colors duration-300`} 
                    />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-semibold text-[#2D3748] group-hover:text-[#2C7A7B] transition-colors duration-300 line-clamp-1">
                        {product.name}
                    </h3>
                    {product.rating && (
                        <div className="flex items-center gap-0.5 bg-[#E6FFFA] px-1.5 py-0.5 rounded-full">
                            <span className="text-[#2C7A7B] text-xs">★</span>
                            <span className="text-xs font-medium text-[#2C7A7B]">{product.rating}</span>
                        </div>
                    )}
                </div>

                <p className="text-xs text-[#4A5568] mb-2 line-clamp-2 min-h-[2rem]">
                    {product.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-[#FC8181]">
                        ${convertToFloat(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-xs text-[#2C7A7B] line-through">
                            ${convertToFloat(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Controls Container */}
                <div className="space-y-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between border border-[#2C7A7B] rounded-lg overflow-hidden">
                        <button
                            onClick={handleDecreaseCount}
                            className="flex-1 px-2 py-1.5 text-[#2C7A7B] hover:bg-[#E6FFFA] transition-colors duration-300"
                        >
                            <FaMinus className="w-3 h-3 mx-auto" />
                        </button>
                        <span className="flex-1 text-center py-1.5 text-[#2C7A7B] font-medium">{count}</span>
                        <button
                            onClick={handleIncreaseCount}
                            className="flex-1 px-2 py-1.5 text-[#2C7A7B] hover:bg-[#E6FFFA] transition-colors duration-300"
                        >
                            <FaPlus className="w-3 h-3 mx-auto" />
                        </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                        onClick={handleAddToBag}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2C7A7B] 
                                 hover:bg-[#FC8181] text-white rounded-lg text-sm font-medium transition-all duration-300 
                                 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <LuShoppingCart className="w-3.5 h-3.5" />
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
}
