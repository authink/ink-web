import staticProps from '@/lib/staticProps'
import { Flex } from 'antd'
import { Col } from 'antd'
import { Descriptions } from 'antd'
import { Row } from 'antd'
import { Tree } from 'antd'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'

export default function Departments() {
  const t = useTranslations()
  const [node, setNode] = useState()
  const treeData = [
    {
      key: 1,
      title: 'A Company (john)',
      data: { id: 1, name: 'A Company' },
      owner: { id: 1, email: 'john@huoyijie.cn' },
      children: [
        {
          key: 2,
          title: 'Sales Department (jack)',
          data: { id: 2, name: 'Sales Department' },
          owner: { id: 2, email: 'jack@huoyijie.cn' },
        },
      ],
    },
  ]
  return (
    <>
      <Head>
        <title>{t('departments')}</title>
      </Head>

      <Row>
        <Col span={16}>
          <Flex align="center" justify="start">
            <Tree
              showLine
              blockNode
              treeData={treeData}
              onSelect={(_, { selected, node }) =>
                setNode(selected ? node : null)
              }
            />
          </Flex>
        </Col>
        <Col span={8}>
          {node && (
            <Descriptions
              column={1}
              items={[
                {
                  key: 'deptName',
                  label: t('deptName'),
                  children: node.data.name,
                },
                {
                  key: 'deptOwner',
                  label: t('deptOwner'),
                  children: node.owner.email,
                },
              ]}
            />
          )}
        </Col>
      </Row>
    </>
  )
}

export async function getStaticProps(context) {
  return staticProps(context.locale, 'departments')
}
