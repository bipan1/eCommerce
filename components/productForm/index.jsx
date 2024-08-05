'use client';

import axios from 'axios';
import { Button, Card, Form, Input, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import MyEditor from '@/components/TextEditor';
import { useForm } from 'antd/es/form/Form';
import { LeftOutlined } from '@ant-design/icons';

export default function ProductForm({ setIsCreate, selectedProduct, setSelectedProduct }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [fileList, setFileList] = useState([]);
    const [form] = useForm();


    useEffect(() => {
        const fetchingCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/category');
                const categoryOptions = response.data.category.map(item => ({ label: item.name, value: item.id }));
                setCategories(categoryOptions);
            } catch (err) {
                console.log(err);
            }
        }
        fetchingCategories();

    }, [])

    useEffect(() => {
        form.setFieldsValue(selectedProduct)
        setFileList(selectedProduct?.images)
    }, [selectedProduct])

    const handleFileChange = (fileList) => {
        console.log(fileList.fileList)
        setFileList(fileList.fileList)
    }

    const beforeUpload = () => {
        return false
    }

    const onCategoryChange = (value) => {
        form.setFieldValue({ categoryId: value })
    }

    const handleCreateProduct = async (values) => {
        let newValues = values;
        if (selectedProduct) {
            const oldImages = [];
            const newImages = [];

            values.images.fileList.forEach(item => {
                if (item.url) {
                    oldImages.push(item.url)
                } else {
                    newImages.push(item);
                }
            })

            newValues = { ...values, images: { fileList: newImages }, oldImages: oldImages }
        }

        const formData = new FormData();
        for (const [key, value] of Object.entries(newValues)) {
            if (key === 'images') {
                value.fileList.map(image => {
                    formData.append('files', image.originFileObj)
                })
            } else {
                formData.append([key], value)
            }
        }

        if (selectedProduct) {
            formData.append('id', selectedProduct.id);
        }


        setLoading(true);
        try {
            if (selectedProduct) {
                const response = await axios.put('http://localhost:3000/api/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                const response = await axios.post('http://localhost:3000/api/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            setLoading(false)
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

    const handleDescriptionChange = (val) => {
        setDescription(val);
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
                                    placeholder="Category"
                                    onChange={onCategoryChange}
                                    options={categories}
                                />
                            </Form.Item>

                            <Form.Item
                                name="inventory"
                                label="Inventory"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter Inventory Amount"
                                    }
                                ]}
                            >
                                <Input type='number' placeholder='Inventory' />
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
                            <MyEditor value={description} onChange={handleDescriptionChange} />
                        </Form.Item>
                    </div>

                    <div>
                        <Form.Item
                            name="images"
                            label="Images"
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={beforeUpload}
                                multiple={true}
                                fileList={fileList}
                                onChange={handleFileChange}

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

// const handleAddSize = () => {
//     if (currentSize && !sizes.includes(currentSize)) {
//         setSizes([...sizes, currentSize]);
//         setCurrentSize('');
//     }
// };

// const handleRemoveSize = (sizeToRemove) => {
//     setSizes(sizes.filter((size) => size !== sizeToRemove));
// };

// const handleAddColor = () => {
//     if (currentColor && !colors.includes(currentColor)) {
//         setColors([...colors, currentColor]);
//         setCurrentColor('');
//     }
// }

// const handleRemoveColor = (colorToRemove) => {
//     setColors(colors.filter((color) => color !== colorToRemove));
// }

{/* <Form.Item>
                    <Checkbox checked={includeSize} onChange={(event) => setIncludeSize(event.target.checked)}>
                        Include size property
                    </Checkbox>
                </Form.Item>

                {includeSize ?
                    <>{sizes.length > 0 ? <Form.Item label="Sizes">
                        <Space>
                            {sizes.map((size) => (
                                <Tag
                                    key={size}
                                    closable
                                    onClose={() => handleRemoveSize(size)}
                                >
                                    {size}
                                </Tag>
                            ))}
                        </Space>
                    </Form.Item> : null}
                        <Form.Item>
                            <Input
                                value={currentSize}
                                onChange={(e) => setCurrentSize(e.target.value)}
                                placeholder="Enter size"
                                style={{ width: 150, marginRight: 8 }}
                            />
                            <Button onClick={handleAddSize}>Add Size</Button>
                        </Form.Item>
                    </> : null}


                <Form.Item>
                    <Checkbox checked={includeColor} onChange={(event) => { setIncludeColor(event.target.checked); setCurrentColor('#2E078C') }}>
                        Include color property
                    </Checkbox>
                </Form.Item> */}

{/* {includeColor ?
                    <>{colors.length > 0 ? <Form.Item label="Colors">
                        <Space>
                            {colors.map((color) => (
                                <Tag
                                    color={color}
                                    key={color}
                                    closable
                                    onClose={() => handleRemoveColor(color)}
                                >
                                    <span className='mr-1'>{color}</span>
                                </Tag>
                            ))}
                        </Space>
                    </Form.Item> : null}
                        <Form.Item>
                            <ColorPicker
                                panelRender={(panel) => (
                                    <div className="custom-panel">
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: 'rgba(0, 0, 0, 0.88)',
                                                lineHeight: '20px',
                                                marginBottom: 8,
                                            }}
                                        >
                                            Color Picker
                                        </div>
                                        {panel}
                                    </div>
                                )}
                                onChange={(_, value) => setCurrentColor(value)}
                                value={currentColor}
                                format='hex'
                                defaultFormat='hex'
                                className='mt-1'
                            />
                            <Button size='small' className="ml-2 border border-black" type="default" onClick={() => handleAddColor()}><FaPlus className='inline' /></Button>
                        </Form.Item>
                    </> : null} */}

// const [includeColor, setIncludeColor] = useState(false);
// const [colors, setColors] = useState([])
// const [currentColor, setCurrentColor] = useState('#2E078C')
// const [includeSize, setIncludeSize] = useState(false);
// const [sizes, setSizes] = useState([])