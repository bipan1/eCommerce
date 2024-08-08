'use client';

import { toast } from 'react-toastify'
import { Button } from "antd";
import axios from "axios";
import AdminPageLayout from "components/adminLayout";
import ProductForm from "components/productForm";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ProductCard from "components/products/productCard";
import { useSelector, useDispatch } from 'react-redux';
import { removeProduct } from '@/redux/features/products-slice';

export default function Products() {
    const deleteSuccess = () => toast.success('Product Deleted Sucessfully.')

    const { data: products, loading, error } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const [isCreate, setIsCreate] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState();

    const editProduct = (productId) => {
        const product = products.find(item => item.id === productId)
        const productToEdit = { ...product, image: { uid: 1, url: product.image } }
        setSelectedProduct(productToEdit)
        setIsCreate(true);
    }

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:3000/api/product`, { data: { id: productId } });
            dispatch(removeProduct(productId))
            deleteSuccess();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AdminPageLayout>
            {!isCreate ? (
                <>
                    <Button onClick={() => setIsCreate(true)} className='mb-5 bg-blue-400' type='primary'><FaPlus className='inline' /><span className='ml-4'>Create Product</span></Button>
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
