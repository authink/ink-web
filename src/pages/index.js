import Head from 'next/head'
import { Button } from 'antd'
import staticProps from '@/lib/staticProps'
import { useTranslations } from 'next-intl'
import { Loading, useQuery } from '@authink/bottlejs'

export default function Dashboard() {
  const t = useTranslations()
  const { data, isLoading, isValidating } = useQuery({
    path: 'admin/dashboard',
  })

  if (isLoading || isValidating) {
    return <Loading />
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
