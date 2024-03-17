import staticProps from '@/lib/staticProps'
import { useDataSource } from '@authink/bottlejs'
import { usePagination } from '@authink/bottlejs'
import { useColumns } from '@authink/bottlejs'
import { Loading, useQuery } from '@authink/bottlejs'
import { Table } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const path = 'admin/tokens'

export default function Tokens() {
  const t = useTranslations()
  const { pagination, limit, offset } = usePagination()
  const { data, isLoading, isValidating } = useQuery({
    path: `${path}?limit=${limit}&offset=${offset}`,
    options: {
      revalidateOnFocus: false,
    },
  })
  pagination.updateTotal(data)
  const dataSource = useDataSource(data?.items ?? [])
  const columns = useColumns([
    'id',
    'appId',
    'appName',
    'accountId',
    'createdAt',
  ])

  if (isLoading || isValidating) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{t('tokens')}</title>
      </Head>

      {data && (
        <Table
          columns={columns}
          rowKey={(token) => token.id}
          dataSource={dataSource}
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
