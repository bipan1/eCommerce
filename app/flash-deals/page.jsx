'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useNotification } from '../../components/notification/NotificationProvider';
import { FaLightningBolt, FaShoppingCart, FaFire, FaClock, FaTag } from 'react-icons/fa';
import { BsLightningCharge, BsFire, BsTag } from 'react-icons/bs';
import { MdLocalOffer } from 'react-icons/md';
import { addItemToCart, addItem } from '@/redux/features/bag-slice';

export default function FlashDealsPage() {
    const [specialProducts, setSpecialProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchSpecialProducts();
    }, []);

    const fetchSpecialProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/product?isSpecial=true');
            if (response.ok) {
                const data = await response.json();
                setSpecialProducts(data.flattenProducts);
            } else {
                showNotification('Failed to fetch flash deals', 'error');
            }
        } catch (error) {
            showNotification('Error loading flash deals', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        const item = {
            productId: product.id,
            name: product.name,
            price: product.isSpecial ? product.specialPrice : product.price,
            image: product.image,
            quantity: 1
        };

        if (session) {
            // User is logged in - use backend cart
            try {
                await dispatch(addItemToCart(item)).unwrap();
                showNotification('Item added to cart!', 'success');
            } catch (error) {
                showNotification(error || 'Failed to add item to cart', 'error');
            }
        } else {
            // Guest user - use local cart
            dispatch(addItem(item));
            showNotification('Item added to cart!', 'success');
        }
    };

    const calculateSavings = (originalPrice, specialPrice) => {
        const savings = originalPrice - specialPrice;
        const percentage = Math.round((savings / originalPrice) * 100);
        return { savings: savings.toFixed(2), percentage };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 animate-pulse">
                                <BsLightningCharge className="text-5xl text-[#FC8181]" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="text-[#FC8181]">Flash</span> Deals
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Limited time offers on your favorite products - Don't miss out!
                        </p>
                        <div className="flex justify-center items-center space-x-2 bg-[#FC8181] text-white rounded-full px-6 py-3 inline-flex">
                            <FaClock className="text-xl animate-pulse" />
                            <span className="font-medium">Limited Time Only!</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deals Stats */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                                <div className="bg-gradient-to-r from-[#FC8181] to-[#F687B3] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BsFire className="text-2xl text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-2">{specialProducts.length}</h3>
                                <p className="text-gray-600">Hot Deals Available</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                                <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaTag className="text-2xl text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-2">Up to 50%</h3>
                                <p className="text-gray-600">Maximum Savings</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                                <div className="bg-gradient-to-r from-[#FC8181] to-[#F687B3] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaClock className="text-2xl text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-2">Daily</h3>
                                <p className="text-gray-600">Updated Offers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#2C7A7B] mb-4">Special Offers</h2>
                            <p className="text-xl text-gray-600">
                                Grab these amazing deals before they're gone!
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C7A7B]"></div>
                            </div>
                        ) : specialProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="bg-white rounded-2xl shadow-xl p-12">
                                    <BsLightningCharge className="text-6xl text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-600 mb-4">No Flash Deals Available</h3>
                                    <p className="text-gray-500 mb-8">
                                        Check back soon for amazing deals and special offers!
                                    </p>
                                    <a 
                                        href="/products" 
                                        className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white px-8 py-3 rounded-lg font-medium hover:from-[#FC8181] hover:to-[#F687B3] transition-all duration-300"
                                    >
                                        Browse All Products
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {specialProducts.map((product) => {
                                    const savings = calculateSavings(parseFloat(product.price), parseFloat(product.specialPrice));
                                    return (
                                        <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {/* Discount Badge */}
                                                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FC8181] to-[#F687B3] text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1">
                                                    <MdLocalOffer className="text-lg" />
                                                    <span>{savings.percentage}% OFF</span>
                                                </div>
                                                {/* Flash Deal Badge */}
                                                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1">
                                                    <BsLightningCharge className="text-sm" />
                                                    <span>FLASH</span>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {product.description}
                                                </p>

                                                {/* Pricing */}
                                                <div className="mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl font-bold text-[#FC8181]">
                                                            ${parseFloat(product.specialPrice).toFixed(2)}
                                                        </span>
                                                        <span className="text-lg text-gray-500 line-through">
                                                            ${parseFloat(product.price).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-green-600 font-medium">
                                                        Save ${savings.savings}
                                                    </div>
                                                </div>

                                                {/* Add to Cart Button */}
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.outofStock}
                                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                                                        product.outofStock
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white hover:from-[#FC8181] hover:to-[#F687B3] transform hover:scale-105'
                                                    }`}
                                                >
                                                    <FaShoppingCart className="text-lg" />
                                                    <span>
                                                        {product.outofStock ? 'Out of Stock' : 'Add to Cart'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">Don't Miss Out!</h2>
                        <p className="text-xl text-white/90 mb-8">
                            New flash deals are added regularly. Check back often for the best savings!
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a 
                                href="/products" 
                                className="bg-white text-[#2C7A7B] px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
                            >
                                <FaShoppingCart className="text-xl" />
                                <span>Browse All Products</span>
                            </a>
                            <a 
                                href="/contact" 
                                className="bg-[#FC8181] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#F687B3] transition-colors duration-300 flex items-center space-x-2"
                            >
                                <BsLightningCharge className="text-xl" />
                                <span>Get Notified</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 