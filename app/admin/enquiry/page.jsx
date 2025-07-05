'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Typography, Space, Tag, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, MailOutlined, PhoneOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNotification } from '../../../components/notification/NotificationProvider';
import { axiosApiCall } from '../../../utils/axiosApiCall';
import AdminPageLayout from "@/components/adminLayout";

const { Title, Text, Paragraph } = Typography;

export default function EnquiryPage() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await axiosApiCall('get', '/api/enquiry');
            if (response.data && response.data.enquiries) {
                setEnquiries(response.data.enquiries);
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            showNotification('Failed to fetch enquiries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (enquiryId) => {
        try {
            setDeleteLoading(true);
            const response = await axiosApiCall('delete', `/api/enquiry/${enquiryId}`);
            
            if (response.data && response.data.success) {
                showNotification('Enquiry deleted successfully', 'success');
                // Remove from local state
                setEnquiries(prev => prev.filter(enquiry => enquiry.id !== enquiryId));
            } else {
                const errorData = response.data || {};
                showNotification(errorData.message || 'Failed to delete enquiry', 'error');
            }
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            showNotification('Error deleting enquiry', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleView = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setIsModalVisible(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            render: (text) => (
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-gray-500" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
            render: (text) => (
                <div className="flex items-center">
                    <MailOutlined className="mr-2 text-gray-500" />
                    <span className="text-blue-600">{text}</span>
                </div>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
            render: (text) => (
                <div className="flex items-center">
                    <PhoneOutlined className="mr-2 text-gray-500" />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Message Preview',
            dataIndex: 'message',
            key: 'message',
            width: 300,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="truncate">
                        {text.length > 100 ? `${text.substring(0, 100)}...` : text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Date Submitted',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (text) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-500" />
                    <span className="text-sm">{formatDate(text)}</span>
                </div>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record)}
                        title="View Details"
                    />
                    <Popconfirm
                        title="Delete Enquiry"
                        description="Are you sure you want to delete this enquiry? This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okType="danger"
                        loading={deleteLoading}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            loading={deleteLoading}
                            title="Delete"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminPageLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <Title level={2} className="!mb-2">Customer Enquiries</Title>
                        <Text type="secondary">
                            Manage and respond to customer enquiries submitted through the contact form
                        </Text>
                    </div>
                    <Tag color="blue" className="text-lg px-4 py-2">
                        Total: {enquiries.length}
                    </Tag>
                </div>

                {/* Enquiries Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={enquiries}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            total: enquiries.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} enquiries`,
                        }}
                        scroll={{ x: 1200 }}
                        className="w-full"
                    />
                </Card>

                {/* View Enquiry Modal */}
                <Modal
                    title={
                        <div className="flex items-center space-x-2">
                            <EyeOutlined className="text-blue-600" />
                            <span>Enquiry Details</span>
                        </div>
                    }
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsModalVisible(false)}>
                            Close
                        </Button>,
                    ]}
                    width={600}
                >
                    {selectedEnquiry && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Text strong className="text-gray-600">Full Name:</Text>
                                    <div className="mt-1">
                                        <Text className="text-lg">{selectedEnquiry.fullName}</Text>
                                    </div>
                                </div>
                                <div>
                                    <Text strong className="text-gray-600">Enquiry ID:</Text>
                                    <div className="mt-1">
                                        <Tag color="blue">#{selectedEnquiry.id}</Tag>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Text strong className="text-gray-600">Email:</Text>
                                    <div className="mt-1">
                                        <Text className="text-blue-600">{selectedEnquiry.email}</Text>
                                    </div>
                                </div>
                                <div>
                                    <Text strong className="text-gray-600">Phone:</Text>
                                    <div className="mt-1">
                                        <Text>{selectedEnquiry.phoneNumber}</Text>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Text strong className="text-gray-600">Date Submitted:</Text>
                                <div className="mt-1">
                                    <Text>{formatDate(selectedEnquiry.createdAt)}</Text>
                                </div>
                            </div>

                            <div>
                                <Text strong className="text-gray-600">Message:</Text>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <Paragraph className="!mb-0 whitespace-pre-wrap">
                                        {selectedEnquiry.message}
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminPageLayout>
    );
} 