'use client'

import { Button, Card, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


export default function Login() {

  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const notify = () => toast();

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      push('/')
    }
  }, [status])


  const handleSubmit = async (values) => {
    setLoading(true)
    const { email, password } = values;
    let res = await signIn("credentials", {
      email,
      password,
      callbackUrl: process.env.NEXTAUTH_URL,
      redirect: false,
    });
    setLoading(false)
    notify("Logged in successfully.")

    if (res?.ok) {
      console.log("success");
      return;
    } else {
      setLoading(false)
      console.log("Failed", res);
    }
    return res;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-1/4 shadow-lg p-4">
        <h3 className="pb-3">Log in to your account</h3>
        <button onClick={() => signIn("google")} className="w-full pl-2 h-12 text-left hover:bg-gray-300 border border-gray mb-3">
          <FcGoogle className='inline' size={30} />
          <span className="ml-3">Continue With Google</span>
        </button>
        <Form name="login" layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="email"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="text-blue-500 underline" href="">
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' loading={loading} className="w-full h-12 bg-blue-400 border border-blue mb-3">
              <span className="ml-3">Login</span>
            </Button>
          </Form.Item>
        </Form>

        <p className='text-center'>Don't have an account? <a href='/signup' className='text-blue-500 underline'>Sign Up</a></p>
      </Card>
    </div>
  )
}
