'use client';

import { useNotification } from '../../../components/notification/NotificationProvider';
import { Button } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '@/redux/features/products-slice';
import ProductForm from 'components/productForm';
import AdminPageLayout from "@/components/adminLayout";
import ProductCard from "components/products/productCard";
import { FaPlus } from "react-icons/fa";
import { axiosApiCall } from 'utils/axiosApiCall';

export default function ProductsPage() {
    const dispatch = useDispatch()
    const { data: products, loading } = useSelector(state => state.products)
    const [isCreate, setIsCreate] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const { showNotification } = useNotification();
    const deleteSuccess = () => showNotification('Product Deleted Successfully.', 'success');

    const editProduct = (productId) => {
        const product = products?.find(item => item.id === productId)
        if (product) {
            const productToEdit = { ...product, image: { uid: 1, url: product.image } }
            setSelectedProduct(productToEdit)
            setIsCreate(true);
        }
    }

    const deleteProduct = async (productId) => {
        try {
            await axiosApiCall('/product', 'DELETE', { data: { id: productId } })
            dispatch(removeProduct(productId))
            deleteSuccess();
        } catch (err) {
            console.log(err)
        }
    }

    // Show loading or handle empty products array
    if (loading) {
        return (
            <AdminPageLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout>
            {!isCreate ? (
                <>
                    <Button onClick={() => setIsCreate(true)} className='mb-5 !bg-green-600' type='primary'><FaPlus className='inline' /><span className='ml-4'>Create Product</span></Button>
                    <div className="flex gap-4 flex-wrap" >
                        {products && products.length > 0 ? (
                            products.map((item, i) =>
                                <div onClick={() => { }} key={item.id}>
                                    <ProductCard item={item} deleteProduct={deleteProduct} editProduct={editProduct} />
                                </div>
                            )
                        ) : (
                            <div className="w-full text-center py-8 text-gray-500">
                                No products found. Create your first product!
                            </div>
                        )}
                    </div>

                </>) : (<ProductForm setIsCreate={setIsCreate} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />)}
        </AdminPageLayout>
    )
}
