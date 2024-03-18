import staticProps from '@/lib/staticProps'
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Loading,
  useColumns,
  useDataSource,
  useMutation,
  usePagination,
  useQuery,
  useSuccess,
} from '@authink/bottlejs'
import { http } from '@authink/commonjs'
import { ignoreError, emailValidator, phoneValidator } from '@authink/commonjs'
import { Switch } from 'antd'
import { Space } from 'antd'
import {
  Typography,
  Flex,
  Table,
  Button,
  Form,
  Modal,
  Input,
  Descriptions,
  Tooltip,
  Drawer,
} from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'

const staffsPath = 'admin/staffs'

export default function Staffs() {
  const t = useTranslations()
  const showSuccess = useSuccess()
  const [openEdit, setOpenEdit] = useState(false)
  const [staffId, setStaffId] = useState()
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
  const currentStaff = data?.items.find((staff) => staff.id === staffId)
  const dataSource = useDataSource(data?.items ?? [])
  const columns = useColumns([
    { name: 'id', type: 'number' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'super', type: 'boolean' },
    { name: 'active', type: 'boolean' },
    { name: 'departure', type: 'boolean' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'updatedAt', type: 'datetime' },
  ])
  const { trigger: addStaff, isMutating: isAdding } = useMutation({
    path,
  })
  const { trigger: updateStaff, isMutating } = useMutation({
    path,
    method: http.PUT,
  })

  if (isLoading || isValidating) {
    return <Loading />
  }

  columns.push({
    title: t('action'),
    key: 'action',
    render: (_, staff) => (
      <Flex wrap="wrap" gap="small">
        <Tooltip title={t('edit')} placement="bottom">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setOpenEdit(true)
              setStaffId(staff.id)
            }}
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
      await addStaff(data)
      closeNew()
      showSuccess(t('newStaffSucceed'))
    })
  }

  const renderDescItem = (currentStaff, field) => {
    switch (field) {
      case 'phone':
        return (
          <Space align="start">
            {currentStaff[field]}{' '}
            <Button type="primary" size="small" disabled={isMutating}>
              {t('edit')}
            </Button>
          </Space>
        )
      case 'super':
        return <Switch checked={currentStaff[field]} disabled />
      case 'active':
      case 'departure':
        return (
          <Switch
            checked={currentStaff[field]}
            onChange={() =>
              ignoreError(async () => {
                await updateStaff(
                  {
                    id: currentStaff.id,
                    activeToggle: field === 'active',
                    departureToggle: field === 'departure',
                  },
                  {
                    optimisticData: (staffs) => ({
                      ...staffs,
                      items: staffs.items.map((a) =>
                        a.id === currentStaff.id
                          ? {
                              ...a,
                              active: field === 'active' ? !a.active : a.active,
                              departure:
                                field === 'departure'
                                  ? !a.departure
                                  : a.departure,
                            }
                          : a,
                      ),
                    }),
                    rollbackOnError: true,
                    revalidate: false,
                  },
                )
              })
            }
            disabled={isMutating}
          />
        )
      default:
        return currentStaff[field]
    }
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

      {currentStaff && (
        <Drawer
          title={t('editStaff')}
          onClose={() => {
            setOpenEdit(false)
            setStaffId(null)
          }}
          open={openEdit}
        >
          <Descriptions
            title={t('basicInfo')}
            column={1}
            items={['id', 'email', 'phone', 'super', 'active', 'departure'].map(
              (field, i) => ({
                key: i + 1,
                label: t(field),
                children: renderDescItem(currentStaff, field),
              }),
            )}
          />
        </Drawer>
      )}
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'staffs')
}
