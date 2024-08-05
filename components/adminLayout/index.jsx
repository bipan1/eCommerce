'use client';
import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Sider, Content } = Layout;


export default function AdminPageLayout({ children }) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link href="/admin/category">Category</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FileTextOutlined />}>
                        <Link href="/admin/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
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
    )
}