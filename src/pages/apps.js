import useQuery from '@/components/hooks/useQuery'
import { setImmediate } from '@authink/commonjs'
import staticProps from '@/lib/staticProps'
import { App, Table } from 'antd'
import { useTranslations, useFormatter } from 'next-intl'
import Head from 'next/head'
import { Active, Loading } from '@authink/bottlejs'

function activeRender(value) {
  return <Active value={value} />
}

export default function Apps() {
  const t = useTranslations()
  const format = useFormatter()
  const { message } = App.useApp()
  const { data, error, isLoading, isValidating } = useQuery({
    path: 'admin/apps',
  })

  if (isLoading || isValidating) {
    return <Loading />
  }

  if (error) {
    setImmediate(() => message.error(error.message))
  }

  const fieldRender = (field) => {
    switch (field) {
      case 'active':
        return activeRender
      case 'createdAt':
      case 'updatedAt':
        return (value) =>
          format.dateTime(new Date(value), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
      default:
        return (value) => value
    }
  }

  return (
    <>
      <Head>
        <title>{t('apps')}</title>
      </Head>

      {data && (
        <Table
          columns={['id', 'name', 'active', 'createdAt', 'updatedAt'].map(
            (field) => ({
              key: field,
              dataIndex: field,
              title: t(field),
              render: fieldRender(field),
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
