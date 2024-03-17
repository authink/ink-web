import staticProps from '@/lib/staticProps'
import { usePagination } from '@authink/bottlejs'
import { Active, Loading, useQuery } from '@authink/bottlejs'
import { Table } from 'antd'
import { useFormatter } from 'next-intl'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const path = 'admin/tokens'

function activeRender(value) {
  return <Active value={value} />
}

export default function Tokens() {
  const t = useTranslations()
  const format = useFormatter()
  const { pagination, limit, offset } = usePagination()
  const { data, isLoading, isValidating } = useQuery({
    path: `${path}?limit=${limit}&offset=${offset}`,
    options: {
      revalidateOnFocus: false,
    },
  })
  pagination.updateTotal(data)

  if (isLoading || isValidating) {
    return <Loading />
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

  const columns = ['id', 'appId', 'appName', 'accountId', 'createdAt'].map(
    (field) => ({
      key: field,
      dataIndex: field,
      title: t(field),
      render: fieldRender(field),
    }),
  )

  return (
    <>
      <Head>
        <title>{t('tokens')}</title>
      </Head>

      {data && (
        <Table
          columns={columns}
          rowKey={(token) => token.id}
          dataSource={data.items.map((item, i) => ({
            key: i + 1,
            ...item,
          }))}
          pagination={pagination}
          scroll={{
            x: true,
          }}
          style={{ height: '100%' }}
        />
      )}
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'tokens')
}
