'use client';

import { Button, Card, Dropdown, Form, Input, Modal } from "antd";
import axios from "axios";
import AdminPageLayout from "components/adminLayout";
import { useEffect, useState } from "react";
import { FaEllipsisH, FaPlus, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Category() {
    const [createModel, setCreateModel] = useState(false);
    const [modelLoading, setModelLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState();
    const [isEdit, setIsEdit] = useState(false)

    const handleCreateCategory = async (values) => {
        setModelLoading(true);
        const { name } = values

        if (isEdit) {
            try {
                const response = await axios.put('http://localhost:3000/api/category', { name, id: selectedCategory.id }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const updatedCategory = response.data.category
                const filteredCategories = categories.filter((item) => item.id !== selectedCategory.id)
                setCategories([...filteredCategories, updatedCategory]);
                setModelLoading(false)
                handleModelClose();
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
                setModelLoading(false)
            }
        } else {
            try {
                const response = await axios.post('http://localhost:3000/api/category', { name }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const createdCategory = response.data.category
                setCategories([...categories, createdCategory])
                setModelLoading(false)
                handleModelClose();
            } catch (error) {
                setError(error.response.data.message)
                setModelLoading(false)
            }
        }
    }

    const handleCategoryDelete = async () => {
        try {
            setLoading(true)
            const response = await axios.delete(`http://localhost:3000/api/category`, { data: { id: selectedCategory.id } });
            setLoading(false)
            const filteredCategories = categories.filter((item) => item.id !== selectedCategory.id)
            setCategories(filteredCategories)
            setSelectedCategory();
        } catch (err) {
            setLoading(false)
            console.log(err)
        }

    }

    const handleCategoryEdit = async () => {
        setCreateModel(true);
        setIsEdit(true);
        form.setFieldsValue({ name: selectedCategory.name })
    }


    useEffect(() => {
        const fetchingCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/category');
                setCategories(response.data.category);
            } catch (err) {
                console.log(err);
            }
        }
        fetchingCategories();
    }, [])

    const handleModelClose = () => {
        setError();
        setCreateModel(false);
        form.setFieldValue()
        setSelectedCategory()
        setIsEdit(false)
    }

    const items = [
        {
            id: '1',
            label: (
                <lable onClick={() => handleCategoryEdit()}>Edit</lable>
            ),
            icon: <FaEdit />
        },
        {
            id: '2',
            label: (
                <lable onClick={() => handleCategoryDelete()}> Delete</ lable>
            ),
            icon: <MdDelete />
        }
    ]

    return (
        <AdminPageLayout>
            <Button onClick={() => setCreateModel(true)} className='float-right border border-black' type='secondary'><FaPlus className='inline' /><span className='ml-4'>Create Category</span></Button>
            {categories.map((item, i) =>
                <Card
                    key={item.id}
                    style={{ width: '50%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    actions={[
                        <Dropdown onClick={() => setSelectedCategory(item)} menu={{ items }} trigger={['click']} key="actions">
                            <FaEllipsisH style={{ cursor: 'pointer' }} />
                        </Dropdown>
                    ]}
                >
                    <Card.Meta
                        title={item.name}
                    />
                </Card>
            )}
            <Modal
                width={700}
                title="Create a Category"
                centered
                open={createModel}
                footer={null}
                onCancel={handleModelClose}
            >
                <Form form={form} name="create-category" layout="vertical" onFinish={handleCreateCategory}>
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

                    {error && <lable style={{ color: 'red' }}>{error}</lable>}

                    <Form.Item style={{ marginTop: 'auto' }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button
                                onClick={() => handleModelClose()}
                                style={{ marginRight: 8 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                loading={modelLoading}
                                htmlType='submit'
                                className="bg-blue-400 border border-blue"
                            >
                                {isEdit ? 'Update' : 'Submit'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminPageLayout>
    )
}
