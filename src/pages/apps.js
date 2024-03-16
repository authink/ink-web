import staticProps from '@/lib/staticProps'
import { Button, Table, Flex, Tooltip } from 'antd'
import { useTranslations, useFormatter } from 'next-intl'
import Head from 'next/head'
import {
  Active,
  Loading,
  useQuery,
  useSuccess,
  useMutation,
} from '@authink/bottlejs'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { http } from '@authink/commonjs'
import { useState } from 'react'
import { ignoreError } from '@authink/commonjs'

function activeRender(value) {
  return <Active value={value} />
}

export default function Apps() {
  const t = useTranslations()
  const showSuccess = useSuccess()
  const format = useFormatter()
  const { data, isLoading, isValidating } = useQuery({
    path: 'admin/apps',
    options: {
      revalidateOnFocus: false,
    },
  })
  const { trigger: updateApp, isMutating } = useMutation({
    path: 'admin/apps',
    method: http.PUT,
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data ? data.length : 0,
    showSizeChanger: true,
    onChange: (page, pageSize) => {
      setPagination({ ...pagination, current: page, pageSize })
    },
    onShowSizeChange: (current, size) => {
      setPagination({ ...pagination, pageSize: size, current: 1 })
    },
  })

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

  const columns = ['id', 'name', 'active', 'createdAt', 'updatedAt'].map(
    (field) => ({
      key: field,
      dataIndex: field,
      title: t(field),
      render: fieldRender(field),
    }),
  )
  columns.push({
    title: t('action'),
    key: 'action',
    render: (_, app) => (
      <Flex wrap="wrap" gap="small">
        <Tooltip title={app.active ? t('lock') : t('unlock')}>
          <Button
            type="primary"
            shape="circle"
            danger
            disabled={isMutating || app.name === 'admin.dev'}
            onClick={() =>
              ignoreError(
                async () =>
                  await updateApp(
                    {
                      id: app.id,
                      activeToggle: true,
                    },
                    {
                      optimisticData: (apps) =>
                        apps.map((a) =>
                          a.id === app.id ? { ...a, active: !a.active } : a,
                        ),
                      rollbackOnError: true,
                      revalidate: false,
                      onSuccess: (data) => {
                        if (data.active) {
                          showSuccess(t('unlockSucceed'))
                        } else {
                          showSuccess(t('lockSucceed'))
                        }
                      },
                    },
                  ),
              )
            }
            icon={app.active ? <UnlockOutlined /> : <LockOutlined />}
          />
        </Tooltip>
      </Flex>
    ),
  })

  return (
    <>
      <Head>
        <title>{t('apps')}</title>
      </Head>

      {data && (
        <Table
          columns={columns}
          dataSource={data.map((item, i) => ({
            key: i + 1,
            ...item,
          }))}
          pagination={pagination}
          style={{ height: '100%' }}
        />
      )}
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'apps')
}
