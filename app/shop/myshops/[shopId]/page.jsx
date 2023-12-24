'use client'
import axios from 'axios';
import { Button, Modal } from 'antd';
import { useEffect, useState } from "react";
import { uploadFileToS3 } from '@/utils/generateAwsUrl';
import { FaPlus } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { startLoading, stopLoading } from "@/redux/features/globalLoading-slice";
import { useAppDispatch } from "@/redux/store";
import ShopForm from "@/components/shopForm";
import ProductForm from 'components/productForm';

export default function Store() {
    const [open, setOpen] = useState(false);
    const [shop, setShop] = useState();
    const [loading, setLoading] = useState(false)

    const { shopId } = useParams();

    const dispatch = useAppDispatch();

    const callPreSignedUrl = async (fileName, fileType) => {
        try {
            const response = await axios.post('http://localhost:3000/api/getSignedUrl', { fileName, fileType });
            return response.data.url;
        } catch (error) {
            console.error('Error getting signed URL:', error);
        }
    };

    useEffect(() => {
        const getShop = async () => {
            dispatch(startLoading())
            try {
                const res = await axios.get(`http://localhost:3000/api/shop/byshopid`, { params: { shopId } })
                setShop(res.data.store)
                dispatch(stopLoading())
            } catch (err) {
                dispatch(stopLoading())
                console.log(err)
            }
        }
        getShop()
    }, [shopId])

    const handleCreatePoduct = async (values) => {

        const images = values.images.fileList

        try {
            const presignedUrls = await Promise.all(images.map((file) => callPreSignedUrl(file.originFileObj.name, file.originFileObj.type)))
            const formattedUrls = presignedUrls.map(url => url.split('?')[0])
            await Promise.all(images.map((file, index) => uploadFileToS3(file.originFileObj, presignedUrls[index])));

            const data = { ...values, images: formattedUrls, userId: session.user.id };

            const response = await axios.post('http://localhost:3000/api/product', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            createPostSucess()
        } catch (error) {
            console.log(error)
        }
    }

    const handleShopUpdate = () => {

    }

    return (
        <div className='p-5'>
            <div className="block w-full text-right">
                <Button onClick={() => setOpen(true)} className="border border-black mt-5" type="default"><FaPlus className='inline mr-4' />Add product</Button>
            </div>

            {shop &&
                <div className='w-1/3'>
                    <span className='font-bold' >{shop.name}</span>
                    <ShopForm handleSubmit={handleShopUpdate} loading={loading} shop={shop} />
                </div>}

            <h1>Products</h1>

            <Modal
                width={700}
                title="Create a product"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
            >
                <ProductForm handleSubmit={handleCreatePoduct} />
            </Modal>
        </div>
    )
}