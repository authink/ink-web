import { NextIntlClientProvider } from 'next-intl'
import { useRouter } from 'next/router'
import '@/styles/global.css'
import Head from 'next/head'
import { ConfigProvider, App, theme } from 'antd'
import useLayout from '@/components/hooks/useLayout'
import AppSWRConfig from '@/components/AppSWRConfig'
import { useState } from 'react'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const Layout = useLayout()
  const [currentTheme, setCurrentTheme] = useState('light')
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Asia/Shanghai"
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
          <Layout currentTheme={currentTheme} toggleTheme={toggleTheme}>
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
