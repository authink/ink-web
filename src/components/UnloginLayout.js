import { Layout, theme } from 'antd'

const { Content } = Layout

export default function UnloginLayout({ children }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Content
        style={{
          flex: '1 0 auto',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}
