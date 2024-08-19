'use client';
import ProductDisplay from "components/products/productDisplay";
import { useSelector } from 'react-redux';
import { getSubCategoryById } from "@/redux/selectors/category";
import { getProductsBySubCategoryId } from "@/redux/selectors/product";

export default function ProductsCategory({ params }) {

    const { categoryId } = params;

    const productsDisplay = useSelector((state) => getProductsBySubCategoryId(state, categoryId))
    const subCategoryName = useSelector((state) => getSubCategoryById(state, categoryId));

    return (
        <div className='mt-10 relative z-[10] overflow-hidden lg:px-20 lg:mx-20 md:px-10 md:mx-10 sm:px-5 sm:mx-5'>
            <div className="flex items-center justify-between">
                <div className="float-left">
                    <h2 className="text-2xl font-bold relative">
                        {subCategoryName}
                        <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-600"></div>
                    </h2>
                </div>
            </div>
            <div className="mx-auto lg:gap-6 grid items-center py-4 grid-cols-2 sm:gap-2 md:gap-3 lg:grid-cols-5">
                {productsDisplay?.map(product => {
                    return <div>
                        <ProductDisplay product={product} />
                    </div>
                })}
            </div>
        </div>
    )
}