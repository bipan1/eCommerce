'use client';

import { Button } from "antd";
import axios from "axios";
import AdminPageLayout from "components/adminLayout";
import ProductForm from "components/productForm";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ProductCard from "components/products/productCard";


export default function Products() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState();
    useEffect(() => {
        const fetchingProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/product');
                setProducts(response.data.products);
            } catch (err) {
                console.log(err);
            }
        }
        fetchingProducts();
    }, [])

    const editProduct = (productId) => {
        const product = products.find(item => item.id === productId)
        const images = product.images.map((newitem, i) => ({ uid: i, url: newitem }));
        const productToEdit = { ...product, images }
        setSelectedProduct(productToEdit)
        setIsCreate(true);
    }

    const deleteProduct = async (productId) => {
        try {
            setLoading(true)
            const response = await axios.delete(`http://localhost:3000/api/product`, { data: { id: productId } });
            setLoading(false)
            const filteredProducts = products.filter((item) => item.id !== productId)
            setProducts(filteredProducts)
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    return (
        <AdminPageLayout>
            {!isCreate ? (
                <>
                    <Button onClick={() => setIsCreate(true)} className='float-right border border-black' type='secondary'><FaPlus className='inline' /><span className='ml-4'>Create Product</span></Button>
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
