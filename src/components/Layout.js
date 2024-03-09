import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'

const { Header, Sider, Content, Footer } = Layout

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>

      <Layout
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            flex: '1 0 auto',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Authink ©{new Date().getFullYear()} Created by huoyijie.cn
        </Footer>
      </Layout>
    </Layout>
  )
}

export default AppLayout
