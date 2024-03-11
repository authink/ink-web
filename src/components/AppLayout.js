import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, Typography, theme } from 'antd'
import copyright from '@/lib/copyright'
import { Flex } from 'antd'
import { Space } from 'antd'
import LocaleSwitcher from './LocaleSwitcher'

const { Header, Sider, Content, Footer } = Layout

const AppLayout = ({ currentTheme, toggleTheme, children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Typography.Title
          level={3}
          style={{
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 32,
            margin: 16,
          }}
        >
          INK
        </Typography.Title>
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
          <Flex justify="space-between">
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

            <Space style={{ paddingRight: 16 }}>
              <LocaleSwitcher />
              <Button
                type="text"
                icon={
                  currentTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />
                }
                onClick={toggleTheme}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Space>
          </Flex>
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
          {copyright()}
        </Footer>
      </Layout>
    </Layout>
  )
}

export default AppLayout
