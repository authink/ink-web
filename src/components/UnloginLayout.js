import { Layout } from 'antd'

const { Content } = Layout

export default function UnloginLayout({ children }) {
  return (
    <Layout>
      <Content
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}
