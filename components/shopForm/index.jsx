'user client'
import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { states } from "@/utils";
import { Button, Checkbox, Form, Input, Select, Upload } from "antd";


export default function ShopForm({ handleSubmit, loading, shop }) {
    const [includeAddress, setIncludeAddress] = useState(false);

    const beforeUpload = (file) => {
        return false;
    };

    const onCheckboxChange = (event) => {
        setIncludeAddress(event.target.checked)
    }

    useEffect(() => {
        if (shop) {
            const hasAddress = shop.addressLine && shop.city && shop.state && shop.zipCode;
            setIncludeAddress(hasAddress);
        }
    }, [shop]);

    return (
        <Form initialValues={shop ? shop : undefined} name="create-post" layout="vertical" onFinish={handleSubmit}>
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
                    maxCount={1}
                    beforeUpload={beforeUpload}
                    defaultFileList={
                        shop && shop.coverImage
                            ? [
                                {
                                    uid: '1',
                                    name: 'current-image.png',
                                    status: 'done',
                                    url: shop.coverImage, // Use the URL from the database
                                },
                            ]
                            : []
                    }
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Checkbox checked={includeAddress} onChange={onCheckboxChange}>
                    Include physical address
                </Checkbox>
            </Form.Item>

            {includeAddress && <div className="p-4 grid lg:grid-cols-2 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4">
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
                    <span className="ml-3">{shop ? 'Update' : 'Create'}</span>
                </Button>
            </Form.Item>
        </Form>
    )
}