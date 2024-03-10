import AppLayout from '@/components/AppLayout'
import '@/styles/global.css'
import Head from 'next/head'
import { ConfigProvider, App, theme } from 'antd'

export default function MyApp({ Component, pageProps }) {
  var a
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <App>
        <AppLayout>
          <Head>
            <meta name="description" content="ink web" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </AppLayout>
      </App>
    </ConfigProvider>
  )
}
