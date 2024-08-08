'use client';

import axios from 'axios';
import { toast } from 'react-toastify'
import { Button, Card, Form, Input, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { LeftOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, editProduct } from '@/redux/features/products-slice';

export default function ProductForm({ setIsCreate, selectedProduct, setSelectedProduct }) {
    const [loading, setLoading] = useState(false);
    const createSuccess = () => toast.success('Product Created Sucessfully.')

    const [form] = useForm();
    const [subCategories, setSubCategories] = useState();
    const { data: categories, loading: load, error } = useSelector((state) => state.category);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedProduct) {
            form.setFieldsValue(selectedProduct)
            const filteredSubCatgories = categories.find(subCat => subCat.id === selectedProduct.categoryId).subcategories;
            setSubCategories(filteredSubCatgories)
        }
    }, [selectedProduct])

    const beforeUpload = () => {
        return false
    }

    const onCategoryChange = (value) => {
        form.setFieldValue({ categoryId: value })
        const filteredSubCatgories = categories.find(subCat => subCat.id === value).subcategories;
        setSubCategories(filteredSubCatgories)
    }

    const handleCreateProduct = async (values) => {
        const categoryId = values.categoryId;
        delete values.categoryId
        const formData = new FormData();
        for (const [key, value] of Object.entries(values)) {
            if (key === 'images') {
                if (value) {
                    formData.append('files', value.fileList[0].originFileObj)
                }
            } else {
                formData.append([key], value)
            }
        }

        if (selectedProduct) {
            formData.append('id', selectedProduct.id);
        }

        let response;
        setLoading(true);
        try {
            if (selectedProduct) {
                response = await axios.put('http://localhost:3000/api/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                dispatch(editProduct({ ...response.data.product, categoryId }))
            } else {
                response = await axios.post('http://localhost:3000/api/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                dispatch(addProduct({ ...response.data.product, categoryId }))
                form.resetFields();
            }
            setLoading(false)
            createSuccess();
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const goBack = () => {
        setIsCreate(false);
        form.resetFields();
        setSelectedProduct()
    }

    return (
        <>
            <Button onClick={() => goBack()} type="link" className="flex items-center mb-4">
                <LeftOutlined />
                <span className="ml-2">Back</span>
            </Button >
            <Card className="w-2/3 shadow-lg p-4s">
                <h1>Create a product</h1>
                <Form form={form} name="create-product" layout="vertical" onFinish={handleCreateProduct}>

                    <div>
                        <div className="grid lg:grid-cols-2 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4 ">
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please Enter a Name',
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Name"
                                />
                            </Form.Item>

                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter price."
                                    }
                                ]}
                            >
                                <Input type='float' placeholder='price' />
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
                            className='mt-5'
                        >
                            <TextArea />
                        </Form.Item>

                        <div className="grid lg:grid-cols-2 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4 ">
                            <Form.Item
                                name="categoryId"
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a category',
                                    },
                                ]}
                            >
                                <Select
                                    fieldNames={{ label: 'name', value: 'id' }}
                                    placeholder="Category"
                                    onChange={onCategoryChange}
                                    options={categories}
                                />
                            </Form.Item>

                            <Form.Item
                                name="subcategoryId"
                                label="Sub Category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a category',
                                    },
                                ]}
                            >
                                <Select
                                    fieldNames={{ label: 'name', value: 'id' }}
                                    placeholder="Category"
                                    options={subCategories}
                                />
                            </Form.Item>
                        </div>


                    </div>

                    <div>
                        <Form.Item
                            name="images"
                            label="Images"
                        >
                            <Upload
                                maxCount={1}
                                listType="picture"
                                beforeUpload={beforeUpload}
                                multiple={false}
                                defaultFileList={selectedProduct ? [selectedProduct.image] : []}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                    </div>

                    <Button
                        loading={loading}
                        htmlType='submit'
                        className="float-right bg-blue-400 border border-blue"
                    >
                        {selectedProduct ? 'Update' : 'Submit'}
                    </Button>
                </Form>
            </Card>
        </>
    )
}