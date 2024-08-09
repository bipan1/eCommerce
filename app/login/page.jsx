'use client'

import { Button, Card, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const { push } = useRouter()
  const loginSuccess = () => toast.success('Logged in Sucessfully')
  const loginFailure = () => toast.error("Couldn't login.")

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      push('/')
    }
  }, [status])

  const handleSubmit = async (values) => {
    setLoading(true)
    const { email, password } = values
    console.log(values);

    try {
      let res = await signIn('credentials', {
        email,
        password,
        callbackUrl: process.env.NEXTAUTH_URL,
        redirect: false,
      })
      loginSuccess()
      setLoading(false)
    } catch (err) {
      loginFailure()
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-1/4 shadow-lg p-4">
        <h3 className="pb-3">Log in to your account</h3>
        <Form name="login" layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
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
            <Button
              htmlType="submit"
              loading={loading}
              className="w-full h-12 bg-blue-400 border border-blue mb-3"
            >
              <span className="ml-3">Login</span>
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 underline">
            Sign Up
          </a>
        </p>
      </Card>
    </div>
  )
}
