'use client';
import ProductDisplay from "components/products/productDisplay";
import { useSelector } from 'react-redux';
import { getCategoryById } from "@/redux/selectors/category";
import { getProductsByCategoryId } from "@/redux/selectors/product";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function ProductsCategory({ params }) {
    const { categoryId } = params;

    const router = useRouter();

    const categoryName = useSelector((state) => getCategoryById(state, categoryId))
    const productsDisplay = useSelector((state) => getProductsByCategoryId(state, categoryId))

    return (
        <>
            <div className="m-2 md:hidden">
                <Button onClick={() => router.back()} type="link" className="flex rounded-2xl !bg-green-900 !text-white" >
                    <IoIosArrowDropleftCircle className="inline mr-2" />
                    <span>Back</span>
                </Button >
            </div>
            <div className='mt-2 relative z-[10] overflow-hidden p-2 md:px-40 lg:px-60'>
                <div className="flex items-center justify-between">
                    <div className="float-left">
                        <h2 className="text-2xl font-bold relative">
                            {categoryName}
                            <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-900"></div>
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
        </>
    )
}