import staticProps from '@/lib/staticProps'
import {
  Loading,
  useColumns,
  useDataSource,
  usePagination,
  useQuery,
} from '@authink/bottlejs'
import { Table, Typography, Flex } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const logsPath = 'admin/logs'

export default function Logs() {
  const t = useTranslations()
  const { pagination, limit, offset } = usePagination()
  const path = `${logsPath}?limit=${limit}&offset=${offset}`
  const { data, isLoading, isValidating } = useQuery({
    path,
    options: {
      revalidateOnFocus: false,
    },
  })
  const dataSource = useDataSource(data ?? [])
  const columns = useColumns([
    { name: 'id', type: 'number' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'appId', type: 'number' },
    { name: 'staffId', type: 'number' },
    { name: 'action', type: 'string' },
    { name: 'resource', type: 'string' },
    { name: 'body', type: 'json' },
  ])

  if (isLoading || isValidating) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{t('logs')}</title>
      </Head>

      <Flex justify="space-between" align="end" style={{ padding: 8 }}>
        <Typography.Title level={3}>{t('logList')}</Typography.Title>
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
  return staticProps(context.locale, 'logs')
}
