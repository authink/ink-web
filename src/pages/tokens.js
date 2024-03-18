import staticProps from '@/lib/staticProps'
import { DeleteOutlined } from '@ant-design/icons'
import {
  Loading,
  useQuery,
  useDataSource,
  usePagination,
  useColumns,
  useSuccess,
  useMutation,
} from '@authink/bottlejs'
import { ignoreError, http } from '@authink/commonjs'
import { Button, Flex, Typography, Tooltip, Popconfirm, Table } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const tokensPath = 'admin/tokens'

export default function Tokens() {
  const t = useTranslations()
  const showSuccess = useSuccess()
  const { pagination, limit, offset } = usePagination()
  const path = `${tokensPath}?limit=${limit}&offset=${offset}`
  const { data, isLoading, isValidating } = useQuery({
    path,
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
  const { trigger: delToken, isMutating } = useMutation({
    path,
    method: http.DELETE,
  })

  if (isLoading || isValidating) {
    return <Loading />
  }

  columns.push({
    title: t('action'),
    key: 'action',
    render: (_, token) => (
      <Flex wrap="wrap" gap="small">
        <Popconfirm
          title={t('confirmDelete')}
          onConfirm={() =>
            ignoreError(async () => {
              await delToken({ id: token.id })
              showSuccess(t('deleteSucceed'))
            })
          }
        >
          <Tooltip title={t('delete')} placement="bottom">
            <Button
              type="primary"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              disabled={isMutating}
            />
          </Tooltip>
        </Popconfirm>
      </Flex>
    ),
  })

  return (
    <>
      <Head>
        <title>{t('tokens')}</title>
      </Head>

      <Flex justify="space-between" align="end" style={{ padding: 8 }}>
        <Typography.Title level={3}>{t('tokenList')}</Typography.Title>
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
  return staticProps(context.locale, 'tokens')
}
