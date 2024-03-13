import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, Typography, theme } from 'antd'
import copyright from '@/lib/copyright'
import { Flex } from 'antd'
import { Space } from 'antd'
import { LocaleSwitcher } from '@authink/bottlejs'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

const { Header, Sider, Content, Footer } = Layout

const AppLayout = ({ currentTheme, toggleTheme, children }) => {
  const t = useTranslations('menu')
  const router = useRouter()
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
          defaultSelectedKeys={['dashboard']}
          onClick={(item) => {
            switch (item.key) {
              case 'apps':
                router.push('/apps')
                return
              default:
                router.push('/')
                return
            }
          }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: t('dashboard'),
            },
            {
              key: 'apps',
              icon: <AppstoreOutlined />,
              label: t('apps'),
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
