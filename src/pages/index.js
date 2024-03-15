import Head from 'next/head'
import { Button } from 'antd'
import staticProps from '@/lib/staticProps'
import { useTranslations } from 'next-intl'
import { Loading, useQuery } from '@authink/bottlejs'
import { setImmediate } from '@authink/commonjs'
import { message } from 'antd'

export default function Dashboard() {
  const t = useTranslations()
  const { data, error, isLoading, isValidating } = useQuery({
    path: 'admin/dashboard',
  })

  if (isLoading || isValidating) {
    return <Loading />
  }

  if (error) {
    setImmediate(() => message.error(error.message))
  }

  return (
    <>
      <Head>
        <title>{t('dashboard')}</title>
      </Head>

      <div>{data && <Button type="primary">{t('welcome')}</Button>}</div>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'dashboard')
}
