'use client';
import { Button, Table, } from 'antd';
import AdminPageLayout from "@/components/adminLayout";
import Spinner from '@/components/spinner';
import { useEffect, useState } from "react";
import { axiosApiCall } from "@/utils/axiosApiCall";
import { parseDate } from '@/utils/dateUtils';

export default function Orders() {

    const [orders, setOrders] = useState();
    const [currentPage, setCurrentPage] = useState("PENDING");
    const [displayOrders, setDisplayOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (orders) {
            const filteredOrders = orders.filter(item => item.status === currentPage);
            setDisplayOrders(filteredOrders);
        }

    }, [currentPage, orders]);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            const response = await axiosApiCall('/order', "GET");
            const ordersData = response.data.orders.map((order, index) => {
                return {
                    ...order,
                    updatedAt: parseDate(order.updatedAt),
                    total: `$ ${(parseInt(order.total) / 100).toFixed(2)}`,
                    index: index + 1
                }
            });
            setOrders(ordersData)
            setLoading(false);
        };

        fetchOrders()
    }, []);

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
                return <Button className="!bg-green-800 !text-white" type="primary">Change Status</Button>
            }
        }
    ]

    return (
        <AdminPageLayout>
            <div>
                {loading && <Spinner />}
                <div className="flex">
                    <div onClick={() => setCurrentPage("PENDING")} className={`py-2 px-10 rounded-lg shadow-sm mr-4 hover:cursor-pointer hover:shadow-lg ${currentPage === "PENDING" ? 'bg-green-800 text-white' : 'bg-white'}`}>
                        Pending
                    </div>
                    <div onClick={() => setCurrentPage("SHIPPED")} className={`py-2 px-10 bg-white rounded-lg shadow-sm mr-4 hover:cursor-pointer hover:shadow-lg ${currentPage === "SHIPPED" ? 'bg-green-800 text-white' : 'bg-white'}`}>
                        Shipped
                    </div>
                    <div onClick={() => setCurrentPage("DELIVERED")} className={`py-2 px-10 bg-white rounded-lg shadow-sm hover:cursor-pointer hover:shadow-lg ${currentPage === "DELIVERED" ? 'bg-green-800 text-white' : 'bg-white'}`}>
                        Delivered
                    </div>
                </div>

                <Table scroll={{ x: 600 }} columns={columns} dataSource={displayOrders} className="shadow-lg mb-5 mt-4" />
            </div>
        </AdminPageLayout>
    )
}