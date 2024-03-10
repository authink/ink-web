import '@/styles/global.css'
import Head from 'next/head'
import { ConfigProvider, App, theme } from 'antd'
import useLayout from '@/components/hooks/useLayout'

export default function MyApp({ Component, pageProps }) {
  const Layout = useLayout()
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <App>
        <Layout>
          <Head>
            <meta name="description" content="ink web" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </App>
    </ConfigProvider>
  )
}
