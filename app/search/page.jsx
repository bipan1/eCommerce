'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductDisplay from '@/components/products/productDisplay';
import { axiosApiCall } from 'utils/axiosApiCall';
import { BsSearch, BsArrowLeft } from 'react-icons/bs';

export default function SearchPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setSearchQuery(query);
                
                const response = await axiosApiCall(`/search?q=${encodeURIComponent(query.trim())}&limit=20`);
                const searchData = response.data;
                
                setProducts(searchData.products || []);
                setTotalResults(searchData.total || 0);
                setHasMore(searchData.hasMore || false);
                
            } catch (error) {
                console.error('Search error:', error);
                setProducts([]);
                setTotalResults(0);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

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
                <div className="flex items-center gap-4 mb-4">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300 font-medium"
                    >
                        <BsArrowLeft className="text-xl" />
                        <span>Back</span>
                    </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                    <BsSearch className="text-3xl text-[#2C7A7B]" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#2C7A7B]">
                            Search Results
                        </h1>
                        {searchQuery && (
                            <p className="text-lg text-gray-600 mt-1">
                                for "<span className="font-medium text-[#2C7A7B]">{searchQuery}</span>"
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="h-1 w-24 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] rounded-full"></div>
                
                <div className="flex items-center justify-between mt-4">
                    <p className="text-gray-600">
                        {totalResults > 0 
                            ? `Found ${totalResults} product${totalResults !== 1 ? 's' : ''}`
                            : 'No products found'
                        }
                        {hasMore && ` (showing first 20)`}
                    </p>
                </div>
            </div>

            {/* Results */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductDisplay product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                        <BsSearch className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No Products Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery 
                                ? `We couldn't find any products matching "${searchQuery}"`
                                : 'Please enter a search term to find products'
                            }
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Try:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Different keywords</li>
                                <li>More general terms</li>
                                <li>Checking your spelling</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-6 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-2 px-6 rounded-lg font-medium hover:from-[#FC8181] hover:to-[#F687B3] transition-all duration-300"
                        >
                            Browse All Products
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}