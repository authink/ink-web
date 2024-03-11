import useQuery from '@/components/hooks/useQuery'
import staticProps from '@/lib/staticProps'
import { App, Table } from 'antd'
import { Spin } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

export default function Apps() {
  const t = useTranslations()
  const { message } = App.useApp()
  const { data, error, isLoading, isValidating } = useQuery({
    path: 'admin/apps',
  })

  if (error) {
    message.error(error.message)
  }

  return (
    <>
      <Head>
        <title>{t('apps')}</title>
      </Head>

      {(isLoading || isValidating) && <Spin size="large" />}

      {data && (
        <Table
          columns={['id', 'name', 'active', 'createdAt', 'updatedAt'].map(
            (field) => ({
              key: field,
              dataIndex: field,
              title: t(field),
            }),
          )}
          dataSource={data.map((item, i) => ({
            key: i + 1,
            ...item,
          }))}
        />
      )}
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'apps')
}
