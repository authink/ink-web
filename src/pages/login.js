import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'

const Login = () => {
  const validateEmail = (_, value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!value || regex.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject('invalid email format')
  }

  const onFinish = (data) => {
    console.log('Received data of form: ', data)
  }

  return (
    <Form
      name="login"
      initialValues={{
        remember: false,
      }}
      style={{
        width: 320,
      }}
      size="large"
      onFinish={onFinish}
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
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a href="" style={{ float: 'right' }}>
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
