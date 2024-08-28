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

export default function ProductDetails({ params }) {
    const [count, setCount] = useState(1);
    const { productId } = params;
    const product = useSelector(state => getProductById(state, productId));
    const categoryName = useSelector((state) => getCategoryById(state, product?.categoryId));

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


    return <div className="flex flex-col lg:flex-row mt-10 w-full lg:gap-4">
        <div className="flex-1 flex justify-center lg:justify-end">
            <div className="w-full lg:w-3/5">
                <section className="bg-black/[0.075] flex items-center justify-center h-[400px] md:h-[500px] md:w-[500px]">
                    <img src={product?.image} />
                </section>
            </div>
        </div>
        <div className="flex-1 w-full lg:w-2/3 mt-4 lg:mt-0">
            <div className="mb-6">
                <Card>
                    <h1 className="font-bold text-2xl">{product?.name}</h1>
                    <div className=" border-b border-blue-600 mb-2">
                        <p className="mt-3 text-lg text-blue-500 ">Description</p>
                    </div>
                    <p className="text-gray-600 text-base">{product?.description}</p>
                    <div className=" border-b border-blue-600 mb-2 mt-2">
                        <p className="mt-3 text-lg text-blue-500 ">About Product</p>
                    </div>
                    <p className="text-gray-500">Category: <span className="ml-2 text-lg text-black">{categoryName}</span></p>
                    <p className="text-gray-500 mt-2">Price: <span className="italic text-lg  ml-2 !text-green-600">${product?.price}</span></p>

                    <div className="flex items-center justify-between mt-10 mb-2">
                        <Button onClick={() => setCount(count + 1)} icon={<FaPlus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
                        <span className="text-xl">{count}</span>
                        <Button onClick={handleDecreaseCount} icon={<FaMinus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
                    </div>
                    <Button onClick={handleAddToBag} className="!bg-green-600 !text-white w-full" icon={<LuShoppingCart size={16} />} >Add to cart</Button>
                </Card>
            </div>
        </div>
    </div>
}