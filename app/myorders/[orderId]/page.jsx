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
        <div className="flex flex-col lg:flex-row w-full lg:gap-4">
            {loading && <Spinner />}
            {order && <div className="flex-1 flex justify-center lg:justify-end mb-10 p-4">
                <div className="w-full lg:w-3/5">
                    <div className="mt-2 mb-4">
                        <Button onClick={() => router.back()} type="link" className="flex rounded-2xl !bg-green-900 !text-white" >
                            <IoIosArrowDropleftCircle className="inline mr-2" />
                            <span>Back</span>
                        </Button >
                    </div>
                    <h1 className="mt-2 text-lg font-bold">Order Summary</h1>
                    <div className="flow-root">
                        <ul role="list" className="-my-2 mt-2">
                            {order.products && order.products.map(item => {
                                return <div>
                                    <li className="flex py-2">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden">
                                            <img src={item.product.image} alt="Product Image" className="h-full w-full object-cover object-center" />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>
                                                        <a href="#">{item.product.name}</a>
                                                        <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                    </h3>
                                                    <p className="ml-4">${parseInt(item.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            })}
                        </ul>
                        <div className="mt-10">
                            <div className="mt-6 flex items-center justify-between border-t pt-2">
                                <p className="text-sm font-medium text-gray-900">Total</p>
                                <p className="text-2xl font-semibold text-gray-900">$ {`${(parseInt(order.total) / 100).toFixed(2)}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <div style={{ minHeight: '100vh' }} className="flex-1 justify-center lg:justify-start bg-white flex">
                <div className="w-full lg:w-2/3 p-6 mr-3">
                </div>
            </div>
        </div>
    )
}