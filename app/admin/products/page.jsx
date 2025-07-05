'use client';

import { useNotification } from '../../../components/notification/NotificationProvider';
import { Button, Card, Col, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Switch, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProdut, fetchProducts } from '@/redux/features/products-slice';
import { fetchCategories } from '@/redux/features/category-slice';
import { format } from 'date-fns';
import ProductForm from 'components/productForm';
import AdminPageLayout from "components/adminLayout";
import ProductCard from "components/products/productCard";
import { FaPlus } from "react-icons/fa";
import { axiosApiCall } from 'utils/axiosApiCall';

export default function ProductsPage() {
    const [form] = useForm()
    const dispatch = useDispatch()
    const { products, loading } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.category)
    const [isCreate, setIsCreate] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const { showNotification } = useNotification();
    const deleteSuccess = () => showNotification('Product Deleted Successfully.', 'success');

    const editProduct = (productId) => {
        const product = products.find(item => item.id === productId)
        const productToEdit = { ...product, image: { uid: 1, url: product.image } }
        setSelectedProduct(productToEdit)
        setIsCreate(true);
    }

    const deleteProduct = async (productId) => {
        try {
            await axiosApiCall('/product', 'DELETE', { data: { id: productId } })
            dispatch(deleteProdut(productId))
            deleteSuccess();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AdminPageLayout>
            {!isCreate ? (
                <>
                    <Button onClick={() => setIsCreate(true)} className='mb-5 !bg-green-600' type='primary'><FaPlus className='inline' /><span className='ml-4'>Create Product</span></Button>
                    <div className="flex gap-4 flex-wrap" >
                        {products.map((item, i) =>
                            <div onClick={() => { }} key={item.id}>
                                <ProductCard item={item} deleteProduct={deleteProduct} editProduct={editProduct} />
                            </div>
                        )}
                    </div>

                </>) : (<ProductForm setIsCreate={setIsCreate} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />)}
        </AdminPageLayout>
    )
}
