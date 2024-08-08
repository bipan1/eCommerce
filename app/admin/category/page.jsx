'use client';

import { toast } from 'react-toastify'
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import AdminPageLayout from "components/adminLayout";
import { useState } from "react";
import CategoryItems from "components/categoryItems";
import { FaPlus } from "react-icons/fa"
import { useSelector, useDispatch } from 'react-redux';
import { removeCategory, addCategory, editCategory } from '@/redux/features/category-slice';

export default function Category() {
    const [createModel, setCreateModel] = useState(false);
    const [modelLoading, setModelLoading] = useState(false);
    const deleteSuccess = () => toast.success('Category deleted sucessfully')
    const createSuccess = () => toast.success('Category created sucessfully')
    const editSuccess = () => toast.success('Category edited sucessfully')


    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState();
    const [isEdit, setIsEdit] = useState(false)

    const { data: categories, loading, error } = useSelector((state) => state.category);

    const dispatch = useDispatch();


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
                dispatch(editCategory(updatedCategory));
                setModelLoading(false)
                handleModelClose();
                editSuccess();
            } catch (error) {
                console.log(error)
                setModelLoading(false)
            }
        } else {
            try {
                const response = await axios.post('http://localhost:3000/api/category', { name }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const createdCategory = { ...response.data.category, subcategories: [] }
                dispatch(addCategory(createdCategory))
                setModelLoading(false)
                handleModelClose();
                createSuccess();
            } catch (error) {
                setModelLoading(false)
            }
        }
    }

    const handleCategoryDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/category`, { data: { id } });
            dispatch(removeCategory(id))
            deleteSuccess();
        } catch (err) {
            console.log(err)
        }
    }

    const handleCategoryEdit = async (item) => {
        setCreateModel(true);
        setIsEdit(true);
        setSelectedCategory(item)
        form.setFieldsValue({ name: item.name })
    }

    const handleModelClose = () => {
        setCreateModel(false);
        form.setFieldValue()
        setSelectedCategory()
        setIsEdit(false)
    }

    return (
        <AdminPageLayout>
            <Button onClick={() => setCreateModel(true)} className='mb-5 bg-blue-400' type='primary'><FaPlus className='inline' /><span className='ml-4'>Create Category</span></Button>
            {categories.map((item, i) =>
                <CategoryItems categories={categories} item={item} handleCategoryDelete={handleCategoryDelete} handleCategoryEdit={handleCategoryEdit} />
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
