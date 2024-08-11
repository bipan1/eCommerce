'use client';
import { Button } from "antd";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { addItem } from '@/redux/features/bag-slice';
import { useDispatch } from 'react-redux';

export default function ProductDisplay({ product }) {
    const [count, setCount] = useState(1);

    const dispatch = useDispatch();

    const handleDecreaseCount = () => {
        if (count <= 1) {
            return;
        }
        setCount(count - 1);
    }

    const handleAddToBag = () => {
        dispatch(addItem(product));
    }

    return <div style={{ width: 300 }} className="relative w-full flex max-w-xs flex-col overflow-hidden rounded-lg border hover:shadow-2xl border-gray-100 bg-white shadow-md">
        <a className="relative flex h-60 overflow-hidden" href="#">
            <img style={{ aspectRatio: 'auto', width: '100%' }} className=" object-cover" src={product.image} alt="product image" />
            {product.outofStock && <span class="absolute top-0 left-0 m-2 rounded-full bg-red-600 px-2 text-center text-sm font-medium text-white">39% OFF</span>}
        </a>
        <div class="mt-3 px-5 pb-5">
            <a href="#">
                <h5 class="text-xl tracking-tight text-slate-900">{product.name}</h5>
            </a>
            <div className="mt-2 mb-3 flex items-center justify-between">
                <p>
                    <span className="text-3xl font-bold text-slate-900">${product.isSpecial ? product.specialPrice : product.price}</span>
                    {product.isSpecial && <span className="text-sm text-slate-900 line-through">${product.product.price}</span>}
                </p>
            </div>
            <div className="flex items-center justify-between mb-2">
                <Button onClick={() => setCount(count + 1)} icon={<FaPlus />} size='large' shape="circle" className="!flex !items-center !justify-center !border-black" />
                <span className="text-xl">{count}</span>
                <Button onClick={handleDecreaseCount} size='large' icon={<FaMinus />} shape="circle" className="!flex !items-center !justify-center !border-black" />
            </div>
            <Button onClick={handleAddToBag} className="!border-black w-full" size="large" icon={<LuShoppingCart size={18} />} >Add to cart</Button>
        </div>
    </div>
}
