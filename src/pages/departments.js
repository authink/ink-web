import staticProps from '@/lib/staticProps'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  useMutation,
  useQuery,
  useLazyQuery,
  useSuccess,
  Loading,
} from '@authink/bottlejs'
import { ignoreError } from '@authink/commonjs'
import { Tooltip } from 'antd'
import { Space } from 'antd'
import { Tree, Flex, Form, Input, Row, Col, Card, Select, Button } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const path = 'admin/departments'

function newDept(t) {
  return {
    id: uuidv4(),
    name: t('newDeptName'),
    ownerId: null,
    ownerName: 'John',
    children: [],
  }
}

function convertDept(dept) {
  return {
    key: dept.id,
    title: `${dept.name} (${dept.ownerName})`,
    data: dept,
    children: dept.children?.map((subDept) => convertDept(subDept)),
  }
}

function findDept(depts, deptId) {
  if (!depts) {
    return
  }

  for (let i = 0; i < depts.length; i++) {
    if (depts[i].id === deptId) {
      return depts[i]
    }

    return findDept(depts[i].children, deptId)
  }
}

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
    depts?.push(newDept(t))
  }
  const selectedDept = findDept(depts, selectedDeptId)
  const treeData = depts?.map(convertDept)

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
                defaultExpandAll
                treeData={treeData}
                selectedKeys={selectedDeptId ? [selectedDeptId] : null}
                onSelect={(_, { selected, node }) => {
                  if (selected) {
                    setSelectedDeptId(node.data.id)
                    form.setFieldsValue({
                      name: node.data.name,
                      ownerId: node.data.ownerId,
                    })
                  } else {
                    setSelectedDeptId(null)
                    form.resetFields()
                  }
                }}
              />
            )}
          </Flex>
        </Col>
        <Col span={8} style={{ height: '100%' }}>
          {selectedDept && (
            <Space direction="vertical" size="large">
              <Card title={t('dept')}>
                <Form
                  form={form}
                  onFinish={(data) =>
                    ignoreError(async () => {
                      const id =
                        typeof selectedDept.id === 'number'
                          ? selectedDept.id
                          : 0
                      const deptId = await saveDept({
                        id,
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
              <Card title={selectedDept.name}>
                <Space size="large">
                  <Tooltip title={t('newSubDept')}>
                    <Button
                      type="dashed"
                      shape="circle"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        const dept = newDept(t)
                        if (!selectedDept.children) {
                          selectedDept.children = [dept]
                        } else {
                          selectedDept.children.push(dept)
                        }
                        setSelectedDeptId(dept.id)
                        form.setFieldsValue({
                          name: dept.name,
                          ownerId: dept.ownerId,
                        })
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={t('delete')}>
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Space>
              </Card>
            </Space>
          )}
        </Col>
      </Row>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'departments')
}
