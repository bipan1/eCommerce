'use client';
import { EditOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

export default function ProductCard({ item, deleteProduct, editProduct }) {
    return (
        <div key={item.id}>
            <Card
                className="hover:shadow-lg"
                hoverable
                style={{ width: 300 }}
                cover={
                    <img
                        alt="example"
                        src={item.images[0]}
                    />
                }
                actions={[
                    <EditOutlined onClick={() => editProduct(item.id)} style={{ color: 'black' }} key="edit" />,
                    <DeleteOutlined onClick={() => deleteProduct(item.id)} style={{ color: 'black' }} key="delete" />,
                ]}
            >
                <div>{item.name}</div>
                <div className='mt-4' style={{ color: 'orange', fontSize: '20px' }}>$ {item.price}.00</div>
            </Card>
        </div>
    )
}
