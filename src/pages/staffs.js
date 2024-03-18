import staticProps from '@/lib/staticProps'
import { MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Loading,
  useColumns,
  useDataSource,
  useMutation,
  usePagination,
  useQuery,
  useSuccess,
} from '@authink/bottlejs'
import { ignoreError, emailValidator, phoneValidator } from '@authink/commonjs'
import { Typography, Flex, Table, Button, Form, Modal, Input } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'

const staffsPath = 'admin/staffs'

export default function Staffs() {
  const t = useTranslations()
  const showSuccess = useSuccess()
  const [openNew, setOpenNew] = useState(false)
  const [form] = Form.useForm()
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
  const { trigger: addStaff, isMutating: isAdding } = useMutation({
    path,
  })

  if (isLoading || isValidating) {
    return <Loading />
  }

  const closeNew = () => {
    setOpenNew(false)
    form.resetFields()
  }

  const onFinish = (data) => {
    ignoreError(async () => {
      await addStaff(data)
      closeNew()
      showSuccess(t('newStaffSucceed'))
    })
  }

  return (
    <>
      <Head>
        <title>{t('staffs')}</title>
      </Head>

      <Flex justify="space-between" align="end" style={{ padding: 8 }}>
        <Typography.Title level={3}>{t('staffList')}</Typography.Title>
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
          rowKey={(record) => record.id}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{
            x: true,
          }}
          style={{ height: '100%' }}
        />
      )}

      <Modal
        title={t('newStaff')}
        centered
        width={300}
        open={openNew}
        onCancel={closeNew}
        onOk={() => form.submit()}
        confirmLoading={isAdding}
      >
        <Form form={form} onFinish={onFinish} disabled={isAdding}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t('invalidEmail'),
              },
              {
                validator: emailValidator(t('invalidEmailFormat')),
              },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
              placeholder={t('email')}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: t('invalidPhone'),
              },
              {
                validator: phoneValidator(t('invalidPhoneFormat')),
              },
            ]}
          >
            <Input
              prefix={
                <PhoneOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              }
              placeholder={t('phone')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'staffs')
}
