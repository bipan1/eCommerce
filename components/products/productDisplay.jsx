'use client';
import { Button } from "antd";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { addItem } from '@/redux/features/bag-slice';
import { useDispatch } from 'react-redux';
import { convertToFloat } from "utils";
import { useRouter } from "next/navigation";

export default function ProductDisplay({ product }) {
    const [count, setCount] = useState(1);

    const router = useRouter();

    const dispatch = useDispatch();

    const handleDecreaseCount = (e) => {
        e.stopPropagation();

        if (count <= 1) {
            return;
        }
        setCount(count - 1);
    }

    const handleIncreaseCount = (e) => {
        e.stopPropagation();
        setCount(count + 1);
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

    const handleCardClick = (e) => {
        e.preventDefault();
        router.push(`/products/${product.id}`)
    }

    return <div className="relative w-full flex max-w-xs flex-col overflow-hidden rounded-lg border hover:shadow-lg border-gray-500">
        <a onClick={handleCardClick} className="relative flex overflow-hidden" href="#">
            <img style={{ aspectRatio: 'auto', width: '100%', height: '27vh', maxHeight: '27vh' }} className=" object-cover" src={product.image} alt="product image" />
            {product.isSpecial && <span className="absolute top-0 left-0 m-2 rounded-full bg-red-600 px-2 text-center text-sm font-medium text-white">Special Offer</span>}
            {product.outofStock && <span className="absolute top-0 left-0 m-2 rounded-full bg-red-600 px-2 text-center text-sm font-medium text-white">Out of stock</span>}
        </a>
        <div className="mt-3 px-5 pb-5">
            <a onClick={handleCardClick} href="#">
                <p className="tracking-tight maintain font-medium text-gray-600">{product.name}</p>
            </a>
            <div className="mt-2 mb-3 flex items-center justify-between">
                <p>
                    <span className="italic text-2xl font-bold text-green-900">${product.isSpecial ? convertToFloat(product.specialPrice) : convertToFloat(product.price)}</span>
                    {product.isSpecial && <span className="italic ml-2 text-md text-green-900 line-through">${convertToFloat(product.price)}</span>}
                </p>
            </div>
            <div className="flex items-center justify-between mb-2">
                <Button onClick={handleIncreaseCount} icon={<FaPlus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
                <span className="text-xl">{count}</span>
                <Button onClick={handleDecreaseCount} icon={<FaMinus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
            </div>
            <Button onClick={handleAddToBag} className="!border-black w-full" icon={<LuShoppingCart size={16} />} >Add to cart</Button>
        </div>
    </div>
}
