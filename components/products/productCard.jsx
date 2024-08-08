'use client';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

export default function ProductCard({ item, deleteProduct, editProduct }) {
    return (
        <div key={item.id}>
            <Card
                className="hover:shadow-lg rounded-lg"
                hoverable
                style={{ width: 300 }}
                cover={
                    <img
                        className='object-cover'
                        style={{ width: '100%', height: 175, borderBottom: '1px solid #DCDCDC', aspectRatio: 'auto' }}
                        alt="example"
                        src={item.image}
                    />
                }
                actions={[
                    <EditOutlined onClick={() => editProduct(item.id)} style={{ fontSize: '20px' }} key="edit" />,
                    <DeleteOutlined onClick={() => deleteProduct(item.id)} style={{ fontSize: '20px' }} key="delete" />,
                ]}
            >
                <h3 style={{ fontSize: 18, fontWeight: 500 }}>{item.name}</h3>
                <div className='mt-1' style={{ color: 'orange', fontSize: '20px' }}>$ {item.price}</div>
            </Card>
        </div>
    )
}
