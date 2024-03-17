import staticProps from '@/lib/staticProps'
import { Button, Table, Flex, Tooltip, App, Row, Col } from 'antd'
import { useTranslations, useFormatter } from 'next-intl'
import Head from 'next/head'
import {
  Active,
  Loading,
  useQuery,
  useSuccess,
  useMutation,
} from '@authink/bottlejs'
import {
  AppstoreAddOutlined,
  KeyOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import { http } from '@authink/commonjs'
import { useState } from 'react'
import { ignoreError } from '@authink/commonjs'
import { Typography } from 'antd'
import { Modal } from 'antd'
import { Form } from 'antd'
import { Input } from 'antd'

const path = 'admin/apps'

function activeRender(value) {
  return <Active value={value} />
}

export default function Apps() {
  const t = useTranslations()
  const showSuccess = useSuccess()
  const format = useFormatter()
  const { modal } = App.useApp()
  const [openNew, setOpenNew] = useState(false)
  const [form] = Form.useForm()
  const { data, isLoading, isValidating } = useQuery({
    path,
    options: {
      revalidateOnFocus: false,
    },
  })
  const { trigger: addApp, isMutating: isAdding } = useMutation({
    path,
  })
  const { trigger: updateApp, isMutating } = useMutation({
    path,
    method: http.PUT,
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
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
        <Tooltip title={t('resetSecret')}>
          <Button
            type="primary"
            shape="circle"
            disabled={isMutating}
            icon={<KeyOutlined />}
            onClick={() =>
              ignoreError(
                async () =>
                  await updateApp(
                    {
                      id: app.id,
                      resetSecret: true,
                    },
                    {
                      revalidate: false,
                      onSuccess: ({ id, secret }) =>
                        modal.success({
                          title: t('resetSecretSucceed'),
                          content: (
                            <div>
                              <Row>
                                <Col span={12}>AppId</Col>
                                <Col span={12}>{id}</Col>
                              </Row>
                              <Row>
                                <Col span={12}>AppSecret</Col>
                                <Col span={12}>{secret}</Col>
                              </Row>
                            </div>
                          ),
                        }),
                    },
                  ),
              )
            }
          />
        </Tooltip>

        <Tooltip title={app.active ? t('lock') : t('unlock')}>
          <Button
            type="primary"
            shape="circle"
            danger
            disabled={isMutating || app.name === 'admin.dev'}
            icon={app.active ? <UnlockOutlined /> : <LockOutlined />}
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
          />
        </Tooltip>
      </Flex>
    ),
  })

  const closeNew = () => {
    setOpenNew(false)
    form.resetFields()
  }

  const onFinish = (data) => {
    ignoreError(async () => {
      await addApp(data)
      closeNew()
      showSuccess(t('newAppSucceed'))
    })
  }

  return (
    <>
      <Head>
        <title>{t('apps')}</title>
      </Head>

      <Flex justify="space-between" align="end" style={{ padding: 8 }}>
        <Typography.Title level={3}>{t('appList')}</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenNew(true)}
        >
          {t('new')}
        </Button>
      </Flex>

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

      <Modal
        title={t('newApp')}
        centered
        width={300}
        open={openNew}
        onCancel={closeNew}
        onOk={() => form.submit()}
        confirmLoading={isAdding}
      >
        <Form form={form} onFinish={onFinish} disabled={isAdding}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: t('invalidAppName'),
              },
              {
                min: 6,
                message: t('invalidAppNameLen'),
              },
            ]}
          >
            <Input
              prefix={
                <AppstoreAddOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              }
              placeholder={t('appName')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'apps')
}
