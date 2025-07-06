'use client';
import { Button } from "antd";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { addItemToCart, addItem } from '@/redux/features/bag-slice';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useNotification } from '../notification/NotificationProvider';
import { convertToFloat } from "utils";
import { useRouter } from "next/navigation";

export default function ProductDisplay({ product }) {
    const [count, setCount] = useState(1);

    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { showNotification } = useNotification();

    const handleDecreaseCount = (e) => {
        e.stopPropagation();
        if (count <= 1) return;
        setCount(count - 1);
    }

    const handleIncreaseCount = (e) => {
        e.stopPropagation();
        setCount(count + 1);
    }

    const handleAddToBag = async (e) => {
        e.stopPropagation();
        
        if (isAdding) return; // Prevent double-clicking

        if (session) {
            // Logged-in user: use backend synchronization
            setIsAdding(true);
            try {
                await dispatch(addItemToCart({
                    productId: product.id,
                    quantity: count,
                    price: product.isSpecial ? product.specialPrice : product.price,
                    image: product.image,
                    name: product.name
                })).unwrap();
                
                showNotification('Item added to cart!', 'success');
                setCount(1); // Reset count after successful add
            } catch (error) {
                console.error('Error adding item to cart:', error);
                showNotification(error || 'Failed to add item to cart', 'error');
            } finally {
                setIsAdding(false);
            }
        } else {
            // Guest user: use local cart only
            dispatch(addItem({
                productId: product.id,
                quantity: count,
                price: product.isSpecial ? product.specialPrice : product.price,
                image: product.image,
                name: product.name
            }));
            showNotification('Item added to cart!', 'success');
            setCount(1); // Reset count after successful add
        }
    }

    const handleCardClick = (e) => {
        e.preventDefault();
        router.push(`/products/${product.id}`)
    }



    return (
        <div 
            onClick={handleCardClick}
            className="group relative bg-white/60 backdrop-blur-sm rounded-2xl 
                     shadow-md hover:shadow-2xl hover:shadow-black/10
                     transition-all duration-500 overflow-hidden h-full 
                     border border-white/20 hover:border-white/40
                     cursor-pointer transform hover:-translate-y-2
                     before:absolute before:inset-0 before:bg-gradient-to-br 
                     before:from-white/80 before:to-white/40 before:rounded-2xl 
                     before:backdrop-blur-sm before:-z-10"
        >
            {/* Product Image Container */}
            <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[4/3] rounded-t-2xl">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                    {product.isSpecial && (
                        <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg backdrop-blur-sm">
                            Special Offer
                        </span>
                    )}
                    {product.outofStock && (
                        <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg backdrop-blur-sm">
                            Out of stock
                        </span>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-2.5 sm:p-4 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                    {product.rating && (
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full backdrop-blur-sm border border-amber-200/50">
                            <span className="text-amber-500 text-xs">★</span>
                            <span className="text-xs font-medium text-amber-700">{product.rating}</span>
                        </div>
                    )}
                </div>

                <p className="text-xs text-slate-600 mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center gap-2 mb-2.5 sm:mb-4">
                    {product.isSpecial && product.specialPrice ? (
                        <>
                            <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                                ${convertToFloat(product.specialPrice)}
                            </span>
                            <span className="text-xs text-slate-500 line-through">
                                ${convertToFloat(product.price)}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            ${convertToFloat(product.price)}
                        </span>
                    )}
                </div>

                {/* Controls Container */}
                <div className="space-y-2 sm:space-y-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={handleDecreaseCount}
                            className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-300"
                        >
                            <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3 mx-auto" />
                        </button>
                        <span className="flex-1 text-center py-1.5 sm:py-2 text-slate-700 font-semibold bg-slate-50/50 text-xs sm:text-sm">{count}</span>
                        <button
                            onClick={handleIncreaseCount}
                            className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-300"
                        >
                            <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 mx-auto" />
                        </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                        onClick={handleAddToBag}
                        disabled={session && isAdding}
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 
                                 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700
                                 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 
                                 shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98]
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                 group-hover:shadow-emerald-500/25"
                    >
                        <LuShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        {(session && isAdding) ? 'Adding...' : 'Add to Bag'}
                    </button>
                </div>
            </div>
        </div>
    );
}
