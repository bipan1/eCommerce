'use client'
import { useEffect, useState } from "react";
import { Button, Table, } from 'antd';
import { axiosApiCall } from "utils/axiosApiCall";
import { parseDate } from "@/utils/dateUtils";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { IoIosArrowDropleftCircle } from "react-icons/io";

export default function Myorders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const columns = [
        {
            title: 'S.N.',
            dataIndex: 'index',

        },
        {
            title: 'Date',
            dataIndex: 'updatedAt'
        },
        {
            title: 'Total Amount',
            dataIndex: 'total'
        },
        {
            title: 'Order Status',
            dataIndex: 'status'
        },
        {
            title: 'View Order Detail',
            key: 'view',
            render: (_, record) => {
                return <Button onClick={() => router.push(`/myorders/${record.id}`)} className="!bg-green-800 !text-white" type="primary">View Detail</Button>
            }
        }
    ]

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            const response = await axiosApiCall('/order/myorders');
            const ordersData = response.data.orders.map((order, index) => {
                return {
                    ...order,
                    updatedAt: parseDate(order.updatedAt),
                    total: `$ ${(parseInt(order.total) / 100).toFixed(2)}`,
                    index: index + 1
                }
            });
            setOrders(ordersData)
            setLoading(false)
        }
        fetchOrders()
    }, []);

    console.log(orders)


    return <div className='mt-2 relative z-[10] overflow-hidden lg:px-20 lg:mx-20 md:px-10 md:mx-10 sm:px-5 sm:mx-5'>
        <div className="m-2">
            <Button onClick={() => router.back()} type="link" className="flex rounded-2xl !bg-green-900 !text-white" >
                <IoIosArrowDropleftCircle className="inline mr-2" />
                <span>Back</span>
            </Button >
        </div>
        {loading && <Spinner />}
        <Table scroll={{ x: 600 }} columns={columns} dataSource={orders} className="shadow-lg mb-5 mt-4" />
    </div>
}