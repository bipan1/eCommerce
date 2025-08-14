'use client'
import { Button, Card } from "antd";
import { useSelector } from 'react-redux';
import { getProductById } from "@/redux/selectors/product";
import { getCategoryById } from "@/redux/selectors/category";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { addItemToCart, addItem } from '@/redux/features/bag-slice';
import { useSession } from 'next-auth/react';
import { useNotification } from '../../../components/notification/NotificationProvider';
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { Slidersettings } from '@/utils/sliderUtils';
import ProductDisplay from "@/components/products/productDisplay";
import { getProductsBySubCategoryId } from "@/redux/selectors/product";

export default function ProductDetails({ params }) {
    const [count, setCount] = useState(1);
    const { productId } = params;
    const product = useSelector(state => getProductById(state, productId));
    const suggestedProducts = useSelector((state) => getProductsBySubCategoryId(state, product?.subcategoryId))


    const categoryName = useSelector((state) => getCategoryById(state, product?.categoryId));
    const router = useRouter();

    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { showNotification } = useNotification();

    const handleDecreaseCount = () => {
        if (count <= 1) {
            return;
        }
        setCount(count - 1);
    }

    const handleAddToBag = async (e) => {
        e.stopPropagation();
        
        if (session) {
            // Logged-in user: use backend synchronization
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

    const goBack = () => {
        router.back();
    }


    if (!product) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-semibold text-[#2C7A7B] mb-2">Product not found</h1>
                <p className="text-[#4A5568] mb-6">The product you are looking for may have been removed or is temporarily unavailable.</p>
                <button onClick={() => router.push('/categories')} className="px-5 py-2 rounded-lg bg-[#2C7A7B] text-white hover:bg-[#FC8181] transition">Browse categories</button>
            </div>
        )
    }

    return <>
        {/* Product JSON-LD for SEO */}
        {product && (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        image: [product.image],
                        description: product.description,
                        brand: { '@type': 'Brand', name: 'Sathiko Kirana Pasal' },
                        offers: {
                            '@type': 'Offer',
                            priceCurrency: 'AUD',
                            price: String(product.isSpecial ? product.specialPrice : product.price),
                            availability: product.outofStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                            url: `https://www.sathikokirana.com.au/products/${product.id}`,
                        }
                    })
                }}
            />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Back Button */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C7A7B]">{product?.name}</h1>
                    <div className="mt-2 h-1 w-20 bg-[#FC8181] rounded-full"></div>
                </div>
                <Button 
                    onClick={() => router.back()} 
                    className="!flex !items-center !gap-2 !text-[#2C7A7B] hover:!text-[#FC8181] !bg-transparent !border-none !shadow-none"
                >
                    <IoIosArrowDropleftCircle className="text-xl" />
                    <span>Back</span>
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Product Image Section */}
                <div className="flex-1">
                    <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-[#E2E8F0]">
                        <div className="aspect-square relative">
                            <img 
                                src={product?.image} 
                                alt={product?.name}
                                className="w-full h-full object-cover object-center"
                            />
                            {product?.isSpecial && (
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#FC8181] text-white shadow-sm">
                                        Special Offer
                                    </span>
                                    {product?.specialPrice && (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#2C7A7B] text-white shadow-sm">
                                            {Math.round(((product.price - product.specialPrice) / product.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
                        {/* Price Section */}
                        <div className="mb-6">
                            {product?.isSpecial && product?.specialPrice ? (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-bold text-[#FC8181]">
                                        ${Number(product.specialPrice).toFixed(2)}
                                    </span>
                                    <span className="text-lg text-[#2C7A7B] line-through">
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-[#2C7A7B]">
                                    ${Number(product?.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-[#2D3748] mb-2">Description</h2>
                            <p className="text-[#4A5568] leading-relaxed">{product?.description}</p>
                        </div>

                        {/* Product Details Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#2D3748] mb-2">Product Details</h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#4A5568]">Category:</span>
                                    <span className="text-[#2C7A7B] font-medium">{categoryName}</span>
                                </div>
                                {product?.rating && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#4A5568]">Rating:</span>
                                        <div className="flex items-center gap-1 bg-[#E6FFFA] px-2 py-1 rounded-full">
                                            <span className="text-[#2C7A7B]">★</span>
                                            <span className="text-[#2C7A7B] font-medium">{product.rating}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border border-[#2C7A7B] rounded-lg overflow-hidden max-w-[200px]">
                                <button
                                    onClick={handleDecreaseCount}
                                    className="flex-1 px-4 py-2 text-[#2C7A7B] hover:bg-[#E6FFFA] transition-colors duration-300"
                                >
                                    <FaMinus className="w-4 h-4 mx-auto" />
                                </button>
                                <span className="flex-1 text-center py-2 text-[#2C7A7B] font-medium text-lg">{count}</span>
                                <button
                                    onClick={() => setCount(count + 1)}
                                    className="flex-1 px-4 py-2 text-[#2C7A7B] hover:bg-[#E6FFFA] transition-colors duration-300"
                                >
                                    <FaPlus className="w-4 h-4 mx-auto" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToBag}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2C7A7B] 
                                         hover:bg-[#FC8181] text-white rounded-lg text-base font-medium 
                                         transition-all duration-300 shadow-sm hover:shadow-md 
                                         transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <LuShoppingCart className="w-5 h-5" />
                                Add to Bag
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggested Products Section */}
            {suggestedProducts?.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#2D3748]">
                                You may also like
                            </h2>
                            <div className="mt-2 h-1 w-20 bg-[#2C7A7B] rounded-full"></div>
                        </div>
                    </div>

                    <div className="relative">
                        <Slider {...Slidersettings}>
                            {suggestedProducts.map(product => (
                                <div key={product.id} className="px-2">
                                    <ProductDisplay product={product} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            )}
        </div>

        <style jsx global>{`
            .slick-prev,
            .slick-next {
                width: 40px;
                height: 40px;
                z-index: 1;
                background: white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .slick-prev:hover,
            .slick-next:hover {
                background: #2C7A7B;
            }
            .slick-prev:hover:before,
            .slick-next:hover:before {
                color: white;
            }
            .slick-prev {
                left: -20px;
            }
            .slick-next {
                right: -20px;
            }
            .slick-prev:before,
            .slick-next:before {
                font-size: 24px;
                color: #2C7A7B;
                opacity: 1;
            }
            @media (max-width: 640px) {
                .slick-prev {
                    left: 5px;
                }
                .slick-next {
                    right: 5px;
                }
            }
        `}</style>
    </>
}