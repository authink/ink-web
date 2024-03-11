import useMutation from '@/components/hooks/useMutation'
import wait from '@/lib/wait'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, message } from 'antd'
import useToken from '@/components/hooks/useToken'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import staticProps from '@/lib/staticProps'
import copyright from '@/lib/copyright'
import LocaleSwitcher from '@/components/LocaleSwitcher'

const appId = Number(process.env.NEXT_PUBLIC_APP_ID)
const appSecret = process.env.NEXT_PUBLIC_APP_SECRET

export default function Login() {
  const router = useRouter()
  const token = useToken()
  const t = useTranslations()
  const [disabled, setDisabled] = useState()
  const { trigger: grantToken, isMutating } = useMutation({
    path: 'token/grant',
  })

  const validateEmail = (_, value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!value || regex.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject('invalid email format')
  }

  const onFinish = async ({ email, password }) => {
    try {
      const data = await grantToken({
        appId,
        appSecret,
        email,
        password,
      })
      setDisabled(true)
      token.set(data)
      message.success('Login succeed')
      await wait(500)
      router.push('/')
    } catch (error) {
      message.error('Login failed')
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Form
        name="login"
        initialValues={{}}
        style={{
          width: 320,
        }}
        size="large"
        onFinish={onFinish}
        disabled={isMutating || disabled}
      >
        <h1 style={{ textAlign: 'center' }}>INK ADMIN</h1>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
            {
              validator: validateEmail,
            },
          ]}
        >
          <Input
            prefix={
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                <UserOutlined />
              </span>
            }
            placeholder="Email"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
            {
              min: 5,
              message: 'Password length can not be less than 5',
            },
          ]}
        >
          <Input.Password
            prefix={
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                <LockOutlined />
              </span>
            }
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={token.rememberMe}
            onChange={(e) => token.setRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>

          <a href="" style={{ float: 'right' }}>
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {t('login')}
          </Button>
        </Form.Item>
      </Form>

      <LocaleSwitcher />

      <div
        style={{
          margin: 12,
        }}
      >
        {copyright()}
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'login')
}
