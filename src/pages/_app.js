import { NextIntlClientProvider } from 'next-intl'
import { useRouter } from 'next/router'
import '@/styles/global.css'
import Head from 'next/head'
import { ConfigProvider, App, theme } from 'antd'
import useLayout from '@/components/hooks/useLayout'
import AppSWRConfig from '@/components/AppSWRConfig'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const Layout = useLayout()
  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Asia/Shanghai"
      messages={pageProps.messages}
    >
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <App>
          <Layout>
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
