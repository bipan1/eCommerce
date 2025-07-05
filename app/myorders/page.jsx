'use client'
import { useEffect, useState } from "react";
import { Button, Table, Tag } from 'antd';
import { axiosApiCall } from "utils/axiosApiCall";
import { parseDate } from "@/utils/dateUtils";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";

export default function Myorders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'processing';
            case 'APPROVED':
                return 'cyan';
            case 'SHIPPED':
                return 'warning';
            case 'DELIVERED':
                return 'success';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (text) => <span className="text-xs sm:text-sm">#{String(text).slice(-6)}</span>
        },
        {
            title: 'Date',
            dataIndex: 'updatedAt',
            key: 'date',
            width: 100,
            render: (text) => <span className="text-xs sm:text-sm whitespace-nowrap">{text}</span>
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: 90,
            render: (text) => <span className="text-xs sm:text-sm font-medium">{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)} className="text-xs sm:text-sm">
                    {status}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button
                    onClick={() => router.push(`/myorders/${record.id}`)}
                    className="!text-xs sm:text-sm !px-2 sm:!px-4 !py-1 sm:!py-2 !bg-[#2C7A7B] !text-white hover:!bg-[#FC8181] !border-none !rounded-lg"
                >
                    View Details
                </Button>
            )
        }
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axiosApiCall('/order/myorders');
                const ordersData = response.data.orders.map((order) => ({
                    ...order,
                    key: order.id,
                    updatedAt: parseDate(order.updatedAt),
                    total: `$${(parseInt(order.total) / 100).toFixed(2)}`,
                }));
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C7A7B]">My Orders</h1>
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
                <p className="mt-4 text-[#4A5568]">
                    Track and manage your orders
                </p>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <Spinner />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center p-8">
                        <p className="text-gray-500 text-lg">No orders found</p>
                        <Button 
                            onClick={() => router.push('/')} 
                            className="mt-4 !bg-[#2C7A7B] !text-white hover:!bg-[#FC8181] !border-none !rounded-lg"
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table 
                            columns={columns} 
                            dataSource={orders}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} orders`,
                                className: "px-2 sm:px-4",
                                size: "small"
                            }}
                            className="orders-table"
                            scroll={{ x: 500 }}
                            size="small"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}