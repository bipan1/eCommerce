import { Button, Checkbox, ColorPicker, Form, Input, Space, Tag, Upload } from 'antd';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';
import MyEditor from '@/components/TextEditor';


export default function ProductForm({ handleSubmit }) {
    const [includeColor, setIncludeColor] = useState(false);
    const [colors, setColors] = useState([])
    const [currentColor, setCurrentColor] = useState('#2E078C')
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

    const handleAddColor = () => {
        if (currentColor && !colors.includes(currentColor)) {
            setColors([...colors, currentColor]);
            setCurrentColor('');
        }
    }

    const handleRemoveColor = (colorToRemove) => {
        setColors(colors.filter((color) => color !== colorToRemove));
    }

    console.log(colors)


    return (
        <Form name="create-product" layout="vertical" onFinish={handleSubmit}>
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
                <MyEditor />
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

            <span className=''>Specifications:</span>
            <Form.Item
                name="specification"
            >
                <MyEditor />
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


            <Form.Item>
                <Checkbox checked={includeColor} onChange={(event) => { setIncludeColor(event.target.checked); setCurrentColor('#2E078C') }}>
                    Include color property
                </Checkbox>
            </Form.Item>

            {includeColor ?
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
                </> : null}
        </Form>
    )
}