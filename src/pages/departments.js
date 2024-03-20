import staticProps from '@/lib/staticProps'
import {
  useMutation,
  useQuery,
  useLazyQuery,
  useSuccess,
  Loading,
} from '@authink/bottlejs'
import { ignoreError } from '@authink/commonjs'
import { Tree, Flex, Form, Input, Row, Col, Card, Select, Button } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'

const path = 'admin/departments'

export default function Departments() {
  const t = useTranslations()
  const showSuccess = useSuccess()
  const [form] = Form.useForm()
  const { data: staffs } = useQuery({
    path: 'admin/staffs/select',
    options: {
      revalidateOnFocus: false,
    },
  })
  const selectStaffs = staffs?.map((staff) => ({
    value: staff.id,
    label: staff.email,
  }))

  const {
    data: depts,
    isLoading,
    isValidating,
  } = useQuery({
    path,
    options: {
      revalidateOnFocus: false,
    },
  })
  const [selectedDeptId, setSelectedDeptId] = useState()
  const selectedDept = depts?.find((dept) => dept.id === selectedDeptId)
  const treeData = depts?.map((dept) => ({
    key: dept.id,
    title: `${dept.name} (${dept.ownerName})`,
    data: dept,
    children: [],
  }))
  const { trigger: checkUnique } = useLazyQuery({
    path,
    options: {
      revalidateOnFocus: false,
    },
  })
  const { trigger: saveDept, isMutating: isSaving } = useMutation({ path })

  if (isLoading || isValidating) {
    return <Loading />
  }

  if (depts?.length === 0) {
    depts?.push({
      id: 0,
      name: t('newDeptName'),
      ownerId: 0,
      ownerName: 'John',
    })
  }

  return (
    <>
      <Head>
        <title>{t('departments')}</title>
      </Head>

      <Row style={{ height: '100%' }}>
        <Col span={16}>
          <Flex align="center" justify="start">
            {depts && (
              <Tree
                showLine
                blockNode
                treeData={treeData}
                selectedKeys={selectedDeptId ? [selectedDeptId] : null}
                onSelect={(_, { selected, node }) =>
                  setSelectedDeptId(selected ? node.data.id : null)
                }
              />
            )}
          </Flex>
        </Col>
        <Col span={8} style={{ height: '100%' }}>
          {selectedDept && (
            <Card title={t('dept')}>
              <Form
                form={form}
                initialValues={{
                  name: selectedDept.name,
                  ownerId: selectedDept.ownerId || null,
                }}
                onFinish={(data) =>
                  ignoreError(async () => {
                    const deptId = await saveDept({
                      id: selectedDept.id,
                      ...data,
                    })
                    setSelectedDeptId(deptId)
                    showSuccess(t('saveSucceed'))
                  })
                }
                disabled={isSaving}
              >
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: t('invalidName'),
                    },
                    {
                      min: 2,
                      message: t('invalidNameLen'),
                    },
                    {
                      validator: async (rule, value) => {
                        const noChanged =
                          selectedDept.id && selectedDept.name === value
                        if (noChanged || !value || value.length < 2) {
                          return Promise.resolve()
                        }
                        const isUnique = await checkUnique(`${value}/unique`)
                        if (isUnique) {
                          return Promise.resolve()
                        }
                        return Promise.reject(t('valueExist'))
                      },
                    },
                  ]}
                >
                  <Input placeholder={t('deptName')} />
                </Form.Item>
                <Form.Item
                  name="ownerId"
                  rules={[
                    {
                      required: true,
                      message: t('invalidOwner'),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    style={{
                      width: '100%',
                    }}
                    placeholder={t('deptOwner')}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input?.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '')
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={selectStaffs}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                  >
                    {t('save')}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'departments')
}
