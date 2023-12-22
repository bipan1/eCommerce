'use client'
import { Button, Checkbox, Form, Input, Modal, Space, Tag, Upload } from 'antd';
import { useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileToS3 } from '../../../../utils/generateAwsUrl';

const callPreSignedUrl = async (fileName, fileType) => {
    try {
        const response = await axios.post('http://localhost:3000/api/getSignedUrl', { fileName, fileType });
        return response.data.url;
    } catch (error) {
        console.error('Error getting signed URL:', error);
    }
};

export default function Store() {
    const [open, setOpen] = useState(false);
    const [includeSize, setIncludeSize] = useState(false);
    const [sizes, setSizes] = useState([])
    const [currentSize, setCurrentSize] = useState('')

    const beforeUpload = () => {
        return false
    }

    const handleAddSize = () => {
        if (currentSize && !sizes.includes(currentSize)) {
            setSizes([...sizes, currentSize]);
            setCurrentSize('');
        }
    };

    const handleRemoveSize = (sizeToRemove) => {
        setSizes(sizes.filter((size) => size !== sizeToRemove));
    };

    const handleCreatePoduct = async (values) => {

        const images = values.images.fileList
        setLoading(true);

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
            setLoading(false)
            createPostSucess()
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)} className="border border-blue text-blue-400">Add product</Button>
            <Modal
                title="Create a product"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                className='w-2/3'
            >
                <Form name="create-post" layout="vertical" onFinish={handleCreatePoduct}>
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
                </Form>
            </Modal>
        </div>
    )
}