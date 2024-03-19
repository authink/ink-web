import staticProps from '@/lib/staticProps'
import { PlusOutlined } from '@ant-design/icons'
import { usePagination } from '@authink/bottlejs'
import { Loading } from '@authink/bottlejs'
import { useDataSource } from '@authink/bottlejs'
import { useColumns } from '@authink/bottlejs'
import { useQuery } from '@authink/bottlejs'
import { Flex } from 'antd'
import { Table } from 'antd'
import { Typography } from 'antd'
import { Button } from 'antd'
import { Select } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'

const groupsPath = 'admin/groups'

export default function Groups() {
  const t = useTranslations()
  const {
    data: apps,
    isLoading,
    isValidating,
  } = useQuery({
    path: 'admin/apps',
    options: {
      revalidateOnFocus: false,
    },
  })
  const defaultAppId = apps ? apps[0]?.id : null
  const [selectedAppId, setSelectedAppId] = useState()
  const appId = selectedAppId ?? defaultAppId
  const { pagination, limit, offset } = usePagination()
  const path = appId
    ? `${groupsPath}?limit=${limit}&offset=${offset}&type=1&appId=${appId}`
    : null
  const { data } = useQuery({
    path,
    options: {
      revalidateOnFocus: false,
    },
  })
  pagination.updateTotal(data)
  const dataSource = useDataSource(data?.items ?? [])
  const columns = useColumns([
    { name: 'id', type: 'number' },
    { name: 'name', type: 'string' },
    { name: 'active', type: 'boolean' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'updatedAt', type: 'datetime' },
  ])

  if (isLoading || isValidating) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{t('groups')}</title>
      </Head>

      <Flex align="center" gap={8} style={{ paddingLeft: 10 }}>
        <Typography.Text>{t('selectApp')}:</Typography.Text>
        <Select
          style={{
            width: 120,
          }}
          defaultValue={defaultAppId}
          options={apps?.map(({ id, name }) => ({ label: name, value: id }))}
          onChange={(value) => setSelectedAppId(value)}
        />
      </Flex>

      <Flex justify="space-between" align="end" style={{ padding: 8 }}>
        <Typography.Title level={3}>{t('groupList')}</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
          {t('new')}
        </Button>
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
  return staticProps(context.locale, 'groups')
}
