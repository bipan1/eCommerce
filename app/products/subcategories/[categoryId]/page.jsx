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
        <div className='mt-2 relative z-[10] overflow-hidden p-2 md:px-40 lg:px-60'>
            <div className="flex items-center justify-between">
                <div className="float-left">
                    <h2 className="text-2xl font-bold relative">
                        {subCategoryName}
                        <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-600"></div>
                    </h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
                {productsDisplay?.map(product => {
                    return <div>
                        <ProductDisplay product={product} />
                    </div>
                })}
            </div>
        </div>
    )
}