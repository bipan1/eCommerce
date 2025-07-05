'use client';
import ProductDisplay from "components/products/productDisplay";
import { useSelector } from 'react-redux';
import { getCategoryById } from "@/redux/selectors/category";
import { getProductsByCategoryId } from "@/redux/selectors/product";
import { BsArrowLeft, BsGrid, BsBoxSeam } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function ProductsCategory({ params }) {
    const { categoryId } = params;

    const router = useRouter();

    const categoryName = useSelector((state) => getCategoryById(state, categoryId))
    const productsDisplay = useSelector((state) => getProductsByCategoryId(state, categoryId))

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="mb-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300 font-medium"
                >
                    <BsArrowLeft className="text-xl" />
                    <span>Back to Categories</span>
                </button>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <BsGrid className="text-3xl text-[#2C7A7B]" />
                    <h1 className="text-3xl md:text-4xl font-bold text-[#2C7A7B]">
                        {categoryName}
                    </h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] rounded-full"></div>
                <div className="flex items-center gap-2 mt-4 text-gray-600">
                    <BsBoxSeam className="text-lg" />
                    <span className="text-lg">
                        {productsDisplay?.length || 0} product{productsDisplay?.length !== 1 ? 's' : ''} found
                    </span>
                </div>
            </div>

            {/* Products Grid */}
            {productsDisplay && productsDisplay.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {productsDisplay.map(product => (
                        <div key={product.id}>
                            <ProductDisplay product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                        <BsBoxSeam className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No Products Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            No products are available in this category at the moment.
                        </p>
                        <button
                            onClick={() => router.push('/categories')}
                            className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-2 px-6 rounded-lg font-medium hover:from-[#FC8181] hover:to-[#F687B3] transition-all duration-300"
                        >
                            Browse Other Categories
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}