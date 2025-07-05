'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { fetchCategories } from '@/redux/features/category-slice';
import { BsGrid, BsBoxSeam } from 'react-icons/bs';
import { FaShoppingBag, FaTshirt, FaMobileAlt, FaLaptop, FaHome, FaUtensils, FaBook, FaGamepad, FaHeartbeat, FaCar, FaLeaf, FaGift, FaSeedling, FaAppleAlt } from 'react-icons/fa';

const categoryImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1566479179817-1436a1a1e4b7?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1609501676725-7186f932c5b7?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582391733983-c9e5bcca7ac8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
];

const categoryIcons = {
    'groceries': FaAppleAlt,
    'electronics': FaLaptop,
    'clothing': FaTshirt,
    'home': FaHome,
    'books': FaBook,
    'sports': FaGamepad,
    'health': FaHeartbeat,
    'automotive': FaCar,
    'beauty': FaLeaf,
    'toys': FaGift,
    'garden': FaSeedling,
    'food': FaUtensils,
    'default': FaShoppingBag
};

export default function CategoriesPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: categories, loading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const getRandomImage = (index) => {
        return categoryImages[index % categoryImages.length];
    };

    const getCategoryIcon = (categoryName) => {
        const key = categoryName.toLowerCase().replace(/\s+/g, '');
        return categoryIcons[key] || categoryIcons.default;
    };

    const handleCategoryClick = (categoryId) => {
        router.push(`/products/categories/${categoryId}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C7A7B]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <BsGrid className="text-3xl text-[#2C7A7B]" />
                    <h1 className="text-3xl md:text-4xl font-bold text-[#2C7A7B]">
                        All Categories
                    </h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] rounded-full"></div>
                <p className="text-gray-600 mt-4 text-lg">
                    Explore our wide range of categories and find exactly what you're looking for.
                </p>
            </div>

            {/* Categories Grid */}
            {categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                        const IconComponent = getCategoryIcon(category.name);
                        return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#2C7A7B] transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getRandomImage(index)}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    
                                    {/* Icon Overlay */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                        <IconComponent className="text-[#2C7A7B] text-xl" />
                                    </div>
                                </div>

                                {/* Category Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#2C7A7B] transition-colors duration-300 mb-2">
                                        {category.name}
                                    </h3>
                                    
                                    {/* Subcategories count */}
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                            <BsBoxSeam className="text-sm" />
                                            <span className="text-sm">
                                                {category.subcategories.length} subcategorie{category.subcategories.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}

                                    {/* View Products Button */}
                                    <button className="w-full bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-2 px-4 rounded-lg font-medium hover:from-[#FC8181] hover:to-[#F687B3] transition-all duration-300 transform group-hover:scale-105">
                                        View Products
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                        <BsGrid className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No Categories Found
                        </h3>
                        <p className="text-gray-500">
                            Categories will appear here once they are added to the system.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 