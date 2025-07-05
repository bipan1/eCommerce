'use client'
import Spinner from "@/components/spinner";
import { useEffect, useState } from "react";
import { axiosApiCall } from "@/utils/axiosApiCall";
import { Button } from "antd";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function OrderDetails({ params }) {
    const { orderId } = params;
    const [order, setOrder] = useState();
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true)
            const orderDetails = await axiosApiCall(`/order/${orderId}`, "GET");
            setOrder(orderDetails.data.order)
            setLoading(false)
        }
        fetchOrderDetails();
    }, [orderId])

    return (
        <>
            {loading && <Spinner />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section with Back Button */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C7A7B]">Order Details</h1>
                        <div className="mt-2 h-1 w-20 bg-[#FC8181] rounded-full"></div>
                    </div>
                    <Button 
                        onClick={() => router.back()} 
                        className="!flex !items-center !gap-2 !text-[#2C7A7B] hover:!text-[#FC8181] !bg-transparent !border-none !shadow-none"
                    >
                        <IoIosArrowDropleftCircle className="text-xl" />
                        <span>Back</span>
                    </Button>
                </div>

                {order && (
                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                        <div className="p-6 border-b border-[#E2E8F0]">
                            <h2 className="text-xl font-semibold text-[#2C7A7B]">Order Summary</h2>
                            <p className="text-sm text-gray-500 mt-1">Order ID: #{order.id}</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="flow-root">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {order.products && order.products.map((item, index) => (
                                        <li key={index} className="py-4 flex items-start">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                                <img 
                                                    src={item.product.image} 
                                                    alt={item.product.name} 
                                                    className="h-full w-full object-cover object-center" 
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-base font-medium text-gray-900 max-w-xs overflow-hidden" 
                                                                style={{ 
                                                                    display: '-webkit-box', 
                                                                    WebkitLineClamp: 2, 
                                                                    WebkitBoxOrient: 'vertical',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                {item.product.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="ml-4 text-base font-medium text-gray-900">
                                                            ${parseInt(item.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium text-gray-900">Total</p>
                                    <p className="text-2xl font-semibold text-[#2C7A7B]">
                                        ${(parseInt(order.total) / 100).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}