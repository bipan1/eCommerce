'use client'
import { Card } from "antd";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react'
import { useState } from "react";
import ShopForm from "@/components/shopForm";
import { uploadSingleFile } from "@/utils/s3/uploadFile";

export default function CreateShop() {

    const [loading, setLoading] = useState(false);

    const createShopSuccess = () => toast.success("Shop created sucessfully.")

    const { data: session } = useSession()


    const handleSubmit = async (values) => {
        const coverImage = values.coverImage.fileList[0].originFileObj;

        try {
            setLoading(true)
            const formattedUrl = await uploadSingleFile(coverImage)
            const postData = { ...values, coverImage: formattedUrl, userId: session.user.id }

            const shopResponse = await axios.post('http://localhost:3000/api/shop', JSON.stringify(postData), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            createShopSuccess()
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log(e)
        }
    }

    return <div className="p-4">
        <h2 className="m-3 text-3xl">Create  a Store</h2>
        <div className="flex space-between w-1/2 gap-2">
            <Card className="w-2/3 shadow-lg p-4s">
                <ShopForm handleSubmit={handleSubmit} loading={loading} />
            </Card>
        </div>
    </div>
}