'use client'
import { toast } from 'react-toastify'
import { Button, Form, Card, Input } from 'antd'
import { useState } from 'react'
import { axiosApiCall } from 'utils/axiosApiCall'

export default function Signup() {

  const [loading, setLoading] = useState(false)
  const createSuccess = () => toast.success('Account created sucessfully.');

  const handleSubmit = async (values) => {

    setLoading(true);
    const res = await axiosApiCall('/user/create', 'POST', values);
    setLoading(false)
    createSuccess();

    if (res.ok) {
      const data = await res.json();
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 flex items-center px-3 justify-center">
      <Card className="w-full max-w-md shadow-lg m-2">
        <h2 className="pb-3 text-lg text-center">Sign Up to create an account.</h2>
        <Form name="normal_login" layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              {
                required: true,
                message: 'Please input your full name!',
              },
            ]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please enter email!',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
              {
                min: 8,
                message: "Password length should be atleast 8."
              }
            ]}
          >
            <Input
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} htmlType='submit' className="w-full h-12 !bg-green-600 !text-white  mb-3">
              <span className="ml-3">Sign Up</span>
            </Button>
          </Form.Item>
        </Form>

        <p className='text-center'>Already have an account? <a href='/login' className='text-blue-500 underline'>Log in</a></p>
      </Card>
    </div>
  )
}
