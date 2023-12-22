'use client'

import { Button, Form, Input } from 'antd'
import { useState } from 'react'

export default function Login() {

  const [loading, setLoading] = useState(false)


  const handleSubmit = async (values) => {

    setLoading(true);
    const res = await fetch("/api/user/create", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(values)
    })
    setLoading(false)

    if (res.ok) {
      const data = await res.json();
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-1/5">
        <h3 className="pb-3">Sign Up and start Learning</h3>
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
            <Button loading={loading} htmlType='submit' className="w-full h-12 bg-blue-400 border border-blue mb-3">
              <span className="ml-3">Sign Up</span>
            </Button>
          </Form.Item>
        </Form>

        <p className='text-center'>Already have an account? <a href='/login' className='text-blue-500 underline'>Log in</a></p>
      </div>
    </div>
  )
}
