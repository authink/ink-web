import Head from 'next/head'
import { Button } from 'antd'
import staticProps from '@/lib/staticProps'
import { useTranslations } from 'next-intl'

export default function Dashboard() {
  const t = useTranslations()
  return (
    <>
      <Head>
        <title>{t('dashboard')}</title>
      </Head>

      <div>
        <Button type="primary">{t('welcome')}</Button>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'dashboard')
}
