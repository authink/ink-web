import AppLayout from '@/components/Layout'
import '@/styles/global.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <AppLayout>
      <Head>
        <meta name="description" content="ink web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AppLayout>
  )
}
