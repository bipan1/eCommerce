'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { Table, } from 'antd';

export default function Myorders() {
    const [orders, setOrders] = useState([]);

    const columns = [
        {
            title: 'S.N.',
            dataIndex: 'id'
        },
        {
            title: 'Total',
            dataIndex: 'total'
        },
        {
            title: 'Status',
            dataIndex: 'status'
        },
        {
            title: 'Date',
            dataIndex: 'updatedAt'
        }
    ]

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get(`http://localhost:3000/api/order/myorders`)
            setOrders(response.data.orders)
        }
        fetchOrders()
    }, []);

    console.log(orders)


    return <div className='mt-10 relative z-[10] overflow-hidden lg:px-20 lg:mx-20 md:px-10 md:mx-10 sm:px-5 sm:mx-5'>
        <Table columns={columns} dataSource={orders} />
    </div>
}