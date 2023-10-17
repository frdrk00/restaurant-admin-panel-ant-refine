import {
  CloseCircleOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { ImageField, List, useTable } from '@refinedev/antd'
import {
  IResourceComponentsProps,
  useDelete,
  useNavigation
} from '@refinedev/core'
import { Dropdown, Menu, Space, Table, Typography } from 'antd'

import { ICourier } from '../../interfaces'

export const TableList: React.FC<IResourceComponentsProps> = () => {
  const { show, edit } = useNavigation()

  const { tableProps } = useTable<ICourier>({
    initialSorter: [
      {
        field: 'id',
        order: 'desc',
      },
    ],
    resource: 'products',
  })

  const { mutate: mutateDelete } = useDelete()

  const moreMenu = (id: number) => (
    <Menu
      mode="vertical"
      onClick={({ domEvent }) => domEvent.stopPropagation()}
    >
      <Menu.Item
        key="accept"
        style={{
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
        }}
        icon={
          <EditOutlined
            style={{
              color: '#52c41a',
              fontSize: 17,
              fontWeight: 500,
            }}
          />
        }
        onClick={() => {
          edit('couriers', id)
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="reject"
        style={{
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
        }}
        icon={
          <CloseCircleOutlined
            style={{
              color: '#EE2A1E',
              fontSize: 17,
            }}
          />
        }
        onClick={() => {
          mutateDelete({
            resource: 'couriers',
            id,
            mutationMode: 'undoable',
          })
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => {
              show('couriers', record.id)
            },
          }
        }}
      >
        <Table.Column
          key="name"
          title="Name"
          render={(record) => (
            <Space>
              <ImageField
                value={record.images[0]?.response}
                width="100%"
                height={50}
                style={{
                  borderRadius: 4,
                }}
              />
              <Typography.Text style={{ wordBreak: 'inherit' }}>
                {record.name} {record.surname}
              </Typography.Text>
            </Space>
          )}
        />

        <Table.Column
          key="description"
          title="Description"
          render={(record) => (
            <Typography.Text style={{ wordBreak: 'inherit' }}>
              {record.description}
            </Typography.Text>
          )}
        />

        <Table.Column<ICourier>
          fixed="right"
          title="Actions"
          dataIndex="actions"
          key="actions"
          render={(_, record) => (
            <Dropdown overlay={moreMenu(record.id)} trigger={['click']}>
              <MoreOutlined
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: 24,
                }}
              />
            </Dropdown>
          )}
        />
      </Table>
    </List>
  )
}
