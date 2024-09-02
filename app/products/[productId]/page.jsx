'use client'
import { Button, Card } from "antd";
import { useSelector } from 'react-redux';
import { getProductById } from "@/redux/selectors/product";
import { getCategoryById } from "@/redux/selectors/category";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { addItem } from '@/redux/features/bag-slice';
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

    const handleDecreaseCount = () => {
        if (count <= 1) {
            return;
        }
        setCount(count - 1);
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

    const goBack = () => {
        router.back();
    }


    return <>
        <div className="m-2 md:hidden">
            <Button onClick={() => goBack()} type="link" className="flex rounded-2xl !bg-green-900 !text-white" >
                <IoIosArrowDropleftCircle className="inline mr-2" />
                <span>Back</span>
            </Button >
        </div>

        <div className="flex flex-col lg:flex-row w-full lg:gap-4 md:mt-4">
            <div className="flex-1 flex justify-center lg:justify-end">
                <div className="w-full lg:w-3/5 p-2">
                    <div className="relative flex overflow-hidden border-2 border-gray-200">
                        <section style={{ aspectRatio: 'auto' }} className="object-cover w-[90%] h-60vh max-h-60vh ">
                            <img src={product?.image} />
                        </section>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-start">
                <div className="w-full lg:w-3/5">
                    <Card>
                        <h1 className="font-bold text-2xl">{product?.name}</h1>
                        <div className=" border-b-2 border-green-900 mb-2">
                            <p className="mt-3 text-lg text-blue-500 ">Description</p>
                        </div>
                        <p className="text-gray-600 text-base">{product?.description}</p>
                        <div className=" border-b-2 border-green-900 mb-2 mt-2">
                            <p className="mt-3 text-lg text-blue-500 ">About Product</p>
                        </div>
                        <p className="text-gray-500">Category: <span className="ml-2 text-lg text-black">{categoryName}</span></p>
                        <p className="text-gray-500 mt-2">Price: <span className="italic text-lg  ml-2 !text-green-900">${product?.price}</span></p>

                        <div className="flex items-center justify-between mt-10 mb-2">
                            <Button onClick={() => setCount(count + 1)} icon={<FaPlus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
                            <span className="text-xl">{count}</span>
                            <Button onClick={handleDecreaseCount} icon={<FaMinus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
                        </div>
                        <Button onClick={handleAddToBag} className="!bg-green-900 !text-white w-full" icon={<LuShoppingCart size={16} />} >Add to cart</Button>
                    </Card>
                </div>
            </div>
        </div>

        <div className='md:px-20 lg:px-40 mt-10 p-2'>
            <div className="flex items-center justify-between mb-4">
                <div className="float-left">
                    <h2 className="text-2xl font-bold relative">
                        You may also like to buy
                        <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-900"></div>
                    </h2>
                </div>
            </div>

            <div className="mb-10">
                <Slider {...Slidersettings} >
                    {suggestedProducts.map(product => {
                        return <div className="ml-10 md:ml-0 lg:ml-0">
                            <ProductDisplay product={product} />
                        </div>
                    })}
                </Slider>
            </div>
        </div>
    </>
}