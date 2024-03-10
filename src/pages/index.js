import Head from 'next/head'
import { Button } from 'antd'

export default function Home() {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <div>
        <Button type="primary">Button</Button>
      </div>
    </>
  )
}
