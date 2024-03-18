import {
  useToken,
  useMutation,
  useSuccess,
  LocaleSwitcher,
} from '@authink/bottlejs'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import staticProps from '@/lib/staticProps'
import copyright from '@/lib/copyright'
import { ignoreError, wait } from '@authink/commonjs'
import { emailValidator } from '@authink/commonjs'

const appId = Number(process.env.NEXT_PUBLIC_APP_ID)
const appSecret = process.env.NEXT_PUBLIC_APP_SECRET

export default function Login() {
  const router = useRouter()
  const token = useToken()
  const t = useTranslations()
  const showSuccess = useSuccess()
  const [disabled, setDisabled] = useState()
  const { trigger: grantToken, isMutating } = useMutation({
    path: 'token/grant',
  })

  const onFinish = ({ email, password }) => {
    ignoreError(async () => {
      const data = await grantToken({
        appId,
        appSecret,
        email,
        password,
      })
      setDisabled(true)
      token.set(data)
      showSuccess(t('loginSucceed'))
      await wait(500)
      router.push('/')
    })
  }

  return (
    <>
      <Head>
        <title>{t('login')}</title>
      </Head>

      <Form
        name="login"
        initialValues={{}}
        width={320}
        size="large"
        onFinish={onFinish}
        disabled={isMutating || disabled}
      >
        <h1 style={{ textAlign: 'center' }}>{t('inkAdmin')}</h1>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: t('invalidEmail'),
            },
            {
              validator: emailValidator(t('invalidEmailFormat')),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
            placeholder={t('email')}
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('invalidPassword'),
            },
            {
              min: 6,
              message: t('invalidPasswordLen'),
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
            placeholder={t('password')}
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={token.rememberMe}
            onChange={(e) => token.setRememberMe(e.target.checked)}
          >
            {t('rememberMe')}
          </Checkbox>

          <a href="" style={{ float: 'right' }}>
            {t('forgotPassword')}
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
