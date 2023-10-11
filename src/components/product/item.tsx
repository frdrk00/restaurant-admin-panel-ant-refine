import { BaseKey } from '@refinedev/core'
import { NumberField } from '@refinedev/antd'
import {
  CloseCircleOutlined,
  FormOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Card,
  Divider,
  InputNumber,
  Dropdown,
  Menu,
  Typography,
} from 'antd'

import { IProduct } from '../../interfaces'

const { Text, Paragraph } = Typography

type ProductItemProps = {
  item: IProduct
  updateStock?: (changedValue: number, clickedProduct: IProduct) => void
  editShow: (id?: BaseKey) => void
}

export const ProductItem: React.FC<ProductItemProps> = ({
  item,
  updateStock,
  editShow,
}) => {
  return (
    <Card
      style={{
        margin: '8px',
        opacity: item.stock <= 0 ? 0.5 : 1,
      }}
      bodyStyle={{ height: '500px' }}
    >
      <div style={{ position: 'absolute', top: '10px', right: '5px' }}>
        <Dropdown
          overlay={
            <Menu mode="vertical">
              {updateStock && (
                <Menu.Item
                  key="1"
                  disabled={item.stock <= 0}
                  style={{
                    fontWeight: 500,
                  }}
                  icon={
                    <CloseCircleOutlined
                      style={{
                        color: 'red',
                      }}
                    />
                  }
                  onClick={() => updateStock(0, item)}
                >
                  Out Of Stock
                </Menu.Item>
              )}
              <Menu.Item
                key="2"
                style={{
                  fontWeight: 500,
                }}
                icon={
                  <FormOutlined
                    style={{
                      color: 'green',
                    }}
                  />
                }
                onClick={() => editShow(item.id)}
              >
                Edit Product
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <MoreOutlined
            style={{
              fontSize: 24,
            }}
          />
        </Dropdown>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Avatar size={128} src={item.images[0].response} alt={item.name} />
        </div>
        <Divider />
        <Paragraph
          ellipsis={{ rows: 2, tooltip: true }}
          style={{
            fontSize: '18px',
            fontWeight: 800,
            marginBottom: '8px',
          }}
        >
          {item.name}
        </Paragraph>
        <Paragraph
          ellipsis={{ rows: 3, tooltip: true }}
          style={{ marginBottom: '8px' }}
        >
          {item.description}
        </Paragraph>
        <Text
          className="item-id"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#999999',
          }}
        >
          #{item?._id.slice(-5).toUpperCase()}
        </Text>
        <NumberField
          style={{
            fontSize: '24px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
          options={{
            currency: 'USD',
            style: 'currency',
          }}
          value={item.price / 100}
        />
        {updateStock && (
          <div id="stock-number">
            <InputNumber
              size="large"
              keyboard
              min={0}
              value={item.stock || 0}
              onChange={(value: number | null) => updateStock(value ?? 0, item)}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
