import staticProps from '@/lib/staticProps'
import {
  Loading,
  useColumns,
  useDataSource,
  usePagination,
  useQuery,
} from '@authink/bottlejs'
import { Typography, Flex, Table } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const staffsPath = 'admin/staffs'

export default function Staffs() {
  const t = useTranslations()
  const { pagination, limit, offset } = usePagination()
  const path = `${staffsPath}?limit=${limit}&offset=${offset}`
  const { data, isLoading, isValidating } = useQuery({
    path,
    options: {
      revalidateOnFocus: false,
    },
  })
  pagination.updateTotal(data)
  const dataSource = useDataSource(data?.items ?? [])
  const columns = useColumns([
    { name: 'id', type: 'number' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'active', type: 'boolean' },
    { name: 'super', type: 'boolean' },
    { name: 'departure', type: 'boolean' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'updatedAt', type: 'datetime' },
  ])

  if (isLoading || isValidating) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{t('staffs')}</title>
      </Head>

      <Flex justify="space-between" align="end" style={{ padding: 8 }}>
        <Typography.Title level={3}>{t('staffList')}</Typography.Title>
      </Flex>

      {data && (
        <Table
          columns={columns}
          rowKey={(record) => record.id}
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
  return staticProps(context.locale, 'staffs')
}
