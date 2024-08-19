'use client';
import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminPrivateRoute from 'components/privateRoute';

const { Sider, Content } = Layout;

function getMenuItemKey(pathname) {
    switch (pathname) {
        case '/admin/category':
            return '1';
        case '/admin/products':
            return '2';
        case '/admin/orders':
            return '3';
        case '/admin/notices':
            return '4';
        default:
            return '1'; // Default to the first item
    }
}


export default function AdminPageLayout({ children }) {

    const pathname = usePathname();
    const [selectedKey, setSelectedKey] = useState(getMenuItemKey(pathname));


    useEffect(() => {
        console.log(pathname)
        setSelectedKey(getMenuItemKey(pathname));
    }, [pathname]);

    return (
        <AdminPrivateRoute>
            <div>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[selectedKey]}
                            selectedKeys={[selectedKey]}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="1" icon={<UserOutlined />}>
                                <Link href="/admin/category">Category</Link>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<FileTextOutlined />}>
                                <Link href="/admin/products">Products</Link>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<DashboardOutlined />}>
                                <Link href="/admin/orders">Orders</Link>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<DashboardOutlined />}>
                                <Link href="/admin/notices">Notices</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px', minHeight: 280 }}>
                        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </AdminPrivateRoute>
    )
}