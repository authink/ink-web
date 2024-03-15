import { NextIntlClientProvider } from 'next-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ConfigProvider, App, theme } from 'antd'
import { useLayout, AppSWRConfig } from '@authink/bottlejs'
import { useState } from 'react'
import { AppstoreOutlined, DashboardOutlined } from '@ant-design/icons'
import copyright from '@/lib/copyright'
import authnRoutes from '@/lib/authnRoutes'

const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const Layout = useLayout(() => authnRoutes.includes(router.pathname))
  const [currentTheme, setCurrentTheme] = useState('light')
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone={timeZone}
      messages={pageProps.messages}
    >
      <ConfigProvider
        theme={{
          algorithm:
            currentTheme === 'dark'
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <App>
          <Layout
            logoText="INK"
            currentTheme={currentTheme}
            toggleTheme={toggleTheme}
            menuItems={[
              {
                key: 'dashboard',
                Icon: DashboardOutlined,
                route: '/',
              },
              {
                key: 'apps',
                Icon: AppstoreOutlined,
                route: '/apps',
              },
            ]}
            copyright={copyright()}
          >
            <Head>
              <meta name="description" content="Ink Admin" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppSWRConfig>
              <Component {...pageProps} />
            </AppSWRConfig>
          </Layout>
        </App>
      </ConfigProvider>
    </NextIntlClientProvider>
  )
}
