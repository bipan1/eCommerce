'use client';

import { Button, Card, Dropdown } from "antd";
import axios from "axios";
import AdminPageLayout from "components/adminLayout";
import ProductForm from "components/productForm";
import { useEffect, useState } from "react";
import { FaEllipsisH, FaPlus } from "react-icons/fa";
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
        const product = products.filter(item => item.id === productId)
        console.log(product)
        setSelectedProduct(product[0])
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
                    <div>
                        <Button onClick={() => setIsCreate(true)} className='float-right border border-black' type='secondary'><FaPlus className='inline' /><span className='ml-4'>Create Product</span></Button>
                    </div>
                    {products.map((item, i) =>
                        <div key={item.id}>
                            <ProductCard item={item} deleteProduct={deleteProduct} editProduct={editProduct} />
                        </div>

                    )}
                </>) : (<ProductForm setIsCreate={setIsCreate} selectedProduct={selectedProduct} />)}
        </AdminPageLayout>
    )
}
