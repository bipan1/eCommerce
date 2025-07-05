'use client';
import { Button, Table, Modal, Select } from 'antd';
import { useNotification } from '../../../components/notification/NotificationProvider';
import AdminPageLayout from "@/components/adminLayout";
import Spinner from '@/components/spinner';
import { useEffect, useState } from "react";
import { axiosApiCall } from "@/utils/axiosApiCall";
import { parseDate } from '@/utils/dateUtils';

const { Option } = Select;

export default function Orders() {

    const [orders, setOrders] = useState();
    const [currentPage, setCurrentPage] = useState("PENDING");
    const [displayOrders, setDisplayOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const { showNotification } = useNotification();

    const statusOptions = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'DELIVERED', label: 'Delivered' }
    ];

    useEffect(() => {
        if (orders) {
            const filteredOrders = orders.filter(item => item.status === currentPage);
            setDisplayOrders(filteredOrders);
        }

    }, [currentPage, orders]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axiosApiCall('/order', "GET");
            const ordersData = response.data.orders.map((order, index) => {
                return {
                    ...order,
                    updatedAt: parseDate(order.updatedAt),
                    total: `$ ${(parseInt(order.total) / 100).toFixed(2)}`,
                    index: index + 1
                }
            });
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showNotification('Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsModalVisible(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) {
            showNotification('Please select a valid status', 'error');
            return;
        }
        
        // Prevent updating to the same status
        if (selectedOrder.status === newStatus) {
            showNotification('Order is already in this status', 'warning');
            return;
        }
        
        setUpdating(true);
        try {
            console.log(`Updating order ${selectedOrder.id} from ${selectedOrder.status} to ${newStatus}`);
            
            const response = await axiosApiCall('/order', 'PATCH', {
                orderId: selectedOrder.id,
                status: newStatus
            });
            
            console.log('Order update response:', response.data);
            
            // Close modal and reset state
            setIsModalVisible(false);
            setSelectedOrder(null);
            setNewStatus('');
            
            // Show success message
            showNotification(`Order #${selectedOrder.id} status updated to ${newStatus} successfully!`, 'success');
            
            // Refresh orders data to get latest updates
            await fetchOrders();
            
        } catch (error) {
            console.error('Error updating order status:', error);
            
            // Show specific error message if available
            let errorMessage = 'Failed to update order status';
            if (error && error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error && error.message) {
                errorMessage = error.message;
            }
            showNotification(errorMessage, 'error');
            
        } finally {
            setUpdating(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
        setNewStatus('');
    };

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
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                return (
                    <Button 
                        className="!bg-blue-600 !text-white hover:!bg-blue-700" 
                        type="primary"
                        onClick={() => handleStatusChange(record)}
                    >
                        Change Status
                    </Button>
                )
            }
        }
    ]

    return (
        <AdminPageLayout>
            <div>
                {loading && <Spinner />}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div onClick={() => setCurrentPage("PENDING")} className={`py-2 px-6 rounded-lg shadow-sm hover:cursor-pointer hover:shadow-lg transition-all ${currentPage === "PENDING" ? 'bg-green-800 text-white' : 'bg-white hover:bg-gray-50'}`}>
                        Pending
                    </div>
                    <div onClick={() => setCurrentPage("APPROVED")} className={`py-2 px-6 rounded-lg shadow-sm hover:cursor-pointer hover:shadow-lg transition-all ${currentPage === "APPROVED" ? 'bg-green-800 text-white' : 'bg-white hover:bg-gray-50'}`}>
                        Approved
                    </div>
                    <div onClick={() => setCurrentPage("SHIPPED")} className={`py-2 px-6 rounded-lg shadow-sm hover:cursor-pointer hover:shadow-lg transition-all ${currentPage === "SHIPPED" ? 'bg-green-800 text-white' : 'bg-white hover:bg-gray-50'}`}>
                        Shipped
                    </div>
                    <div onClick={() => setCurrentPage("DELIVERED")} className={`py-2 px-6 rounded-lg shadow-sm hover:cursor-pointer hover:shadow-lg transition-all ${currentPage === "DELIVERED" ? 'bg-green-800 text-white' : 'bg-white hover:bg-gray-50'}`}>
                        Delivered
                    </div>
                </div>

                <Table scroll={{ x: 600 }} columns={columns} dataSource={displayOrders} className="shadow-lg mb-5" />
                
                {/* Status Change Modal */}
                <Modal
                    title="Change Order Status"
                    visible={isModalVisible}
                    onOk={handleUpdateStatus}
                    onCancel={handleModalCancel}
                    confirmLoading={updating}
                    okText="Update Status"
                    cancelText="Cancel"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order ID: #{selectedOrder?.id}
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Status: {selectedOrder?.status}
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Status
                            </label>
                            <Select
                                value={newStatus}
                                onChange={setNewStatus}
                                className="w-full"
                                placeholder="Select new status"
                            >
                                {statusOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminPageLayout>
    )
}