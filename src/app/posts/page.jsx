'use client'
import { catergories, states } from "@/utils";
import { Button, Card, Checkbox, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react'
import { uploadFileToS3 } from '@/utils/generateAwsUrl'
import { useState } from "react";

export default function CreatePost() {

    const [loading, setLoading] = useState(false);
    const [includeAddress, setIncludeAddress] = useState(false);

    const createPostSucess = () => toast.success("Post created Sucessfully");

    const beforeUpload = (file) => {
        return false;
    };

    const { data: session } = useSession()

    const callPreSignedUrl = async (fileName, fileType) => {
        try {
            const response = await axios.post('http://localhost:3000/api/getSignedUrl', { fileName, fileType });
            return response.data.url;
        } catch (error) {
            console.error('Error getting signed URL:', error);
        }
    };


    const handleCreatePost = async (values) => {

        const images = values.images.fileList
        setLoading(true);

        try {
            const presignedUrls = await Promise.all(images.map((file) => callPreSignedUrl(file.originFileObj.name, file.originFileObj.type)))
            const formattedUrls = presignedUrls.map(url => url.split('?')[0])
            await Promise.all(images.map((file, index) => uploadFileToS3(file.originFileObj, presignedUrls[index])));

            const data = { ...values, images: formattedUrls, userId: session.user.id };


            const response = await axios.post('http://localhost:3000/api/post', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setLoading(false)
            createPostSucess()
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return <div className="p-4">
        <h2 className="m-3 text-3xl">Create  a Post</h2>
        <div className="flex space-between w-1/2 gap-2">
            <Card className="w-2/3 shadow-lg p-4s">
                <Form name="create-post" layout="vertical" onFinish={handleCreatePost}>
                    <div className="grid lg:grid-cols-2 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4 ">
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Enter a title',
                                },
                            ]}
                        >
                            <Input
                                type="text"
                                placeholder="Title"
                            />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose a category"
                                }
                            ]}
                        >
                            <Select
                                options={catergories}
                            />
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
                        />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Images"
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={beforeUpload}
                            multiple={true}

                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Checkbox checked={includeAddress} onChange={(event) => setIncludeAddress(event.target.checked)}>
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