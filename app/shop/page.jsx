'use client'
import { states } from "@/utils";
import { Button, Card, Checkbox, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react'
import { useState } from "react";
import { uploadFileToS3 } from '@/utils/generateAwsUrl'

export default function CreatePost() {

    const [includeAddress, setIncludeAddress] = useState(false);
    const [loading, setLoading] = useState(false);

    const createShopSuccess = () => toast.success("Shop created sucessfully.")


    const beforeUpload = (file) => {
        return false;
    };

    const onCheckboxChange = (event) => {
        setIncludeAddress(event.target.checked)
    }

    const { data: session } = useSession()


    const handleCreateShop = async (values) => {
        const coverImage = values.coverImage.fileList[0].originFileObj;
        const { name, type } = coverImage

        try {
            setLoading(true)
            const response = await axios.post('http://localhost:3000/api/getSignedUrl', { fileName: name, fileType: type });
            const { url } = response.data;
            const formattedUrl = url.split('?')[0]
            const postData = { ...values, coverImage: formattedUrl, userId: session.user.id }
            await uploadFileToS3(coverImage, url)

            const postResponse = await axios.post('http://localhost:3000/api/shop', JSON.stringify(postData), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(postResponse)
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
                <Form encType="multipart/form-data" name="create-post" layout="vertical" onFinish={handleCreateShop}>
                    <div className="grid lg:grid-cols-2 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4 ">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Enter a name',
                                },
                            ]}
                        >
                            <Input
                                type="text"
                                placeholder="Name"
                            />
                        </Form.Item>

                        <Form.Item
                            name="contact"
                            label="Contact number"
                            rules={[
                                {
                                    required: true,
                                    message: "Include contact number"
                                }
                            ]}
                        >
                            <Input type="text" placeholder="Contact number" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please Enter the description',
                            },
                        ]}
                    >
                        <Input.TextArea
                            type="text"
                            placeholder="Description"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        name="coverImage"
                        label="Cover Image"
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Checkbox checked={includeAddress} onChange={onCheckboxChange}>
                            Include physical address
                        </Checkbox>
                    </Form.Item>

                    {includeAddress && <div className="shadow-lg p-4 grid lg:grid-cols-2 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4">
                        <Form.Item
                            name="addressLine"
                            label="Address Line"
                        >
                            <Input
                                type="text"
                                placeholder="Address Line"
                            />
                        </Form.Item>

                        <Form.Item
                            name="city"
                            label="City"
                        >
                            <Input
                                type="text"
                                placeholder="City"
                            />
                        </Form.Item>

                        <Form.Item
                            name="state"
                            label="State"
                        >
                            <Select
                                placeholder="State"
                                options={states}
                            />
                        </Form.Item>

                        <Form.Item
                            name="zipCode"
                            label="Zip Code"
                        >
                            <Input
                                type="number"
                                placeholder="Zip"
                            />
                        </Form.Item>
                    </div>}


                    <Form.Item>
                        <Button loading={loading} htmlType='submit' className="w-full h-12 bg-blue-400 border border-blue mb-3">
                            <span className="ml-3">Submit</span>
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    </div>
}