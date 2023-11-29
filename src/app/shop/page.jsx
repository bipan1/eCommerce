'use client'
import { catergories, exclude, states } from "@/utils";
import { Button, Card, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react'
import AWS from 'aws-sdk'
import { useState } from "react";

export default function CreatePost() {


    const beforeUpload = (file) => {
        return false;
    };

    const { data: session } = useSession()


    const handleCreatePost = async (values) => {

        const formData = new FormData();
        formData.append('userId', session.user.id)
        values.images.fileList.forEach(file => {
            formData.append(`files`, file.originFileObj, file.originFileObj.name)
        })
        const updatedValues = exclude(values, ['images'])
        for (const [key, value] of Object.entries(updatedValues)) {
            formData.append(key, value)
        }

        try {
            const response = await axios.post('http://localhost:3000/api/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return <div className="p-4">
        <h2 className="m-3">Create  a Store</h2>
        <div className="flex space-between gap-4">
            <Card className="w-2/3 shadow-lg p-4s">
                <Form encType="multipart/form-data" name="create-post" layout="vertical" onFinish={handleCreatePost}>
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
                        name="image"
                        label="Cover Image"
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
                        <button type="submit" className="w-full h-12 bg-blue-400 border border-blue mb-3">
                            <span className="ml-3">Submit</span>
                        </button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    </div>
}