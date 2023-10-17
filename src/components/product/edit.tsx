import { useApiUrl, BaseKey } from '@refinedev/core'
import { Edit, getValueFromEvent, useSelect } from '@refinedev/antd'
import {
  Drawer,
  DrawerProps,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  ButtonProps,
  Avatar,
  Typography,
  Upload,
  Grid,
} from 'antd'

import { ICategory } from '../../interfaces'

const { Text } = Typography

type EditProductProps = {
  drawerProps: DrawerProps
  formProps: FormProps
  saveButtonProps: ButtonProps
  editId?: BaseKey
}

export const EditProduct: React.FC<EditProductProps> = ({
  drawerProps,
  formProps,
  saveButtonProps,
  editId,
}) => {
  const apiUrl = useApiUrl()
  const breakpoint = Grid.useBreakpoint()

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: 'categories',
    optionLabel: 'title',
    optionValue: 'categoryId',
  })

  return (
    <Drawer
      {...drawerProps}
      width={breakpoint.sm ? '500px' : '100%'}
      zIndex={1001}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        resource="products"
        recordItemId={editId}
        contentProps={{
          style: {
            boxShadow: 'none',
          },
          bodyStyle: {
            padding: 0,
          },
        }}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item label="Images">
            <Form.Item
              name="images"
              valuePropName="fileList"
              getValueFromEvent={getValueFromEvent}
              noStyle
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                action={`${apiUrl}/media/upload`}
                listType="picture"
                maxCount={1}
                accept=".png"
              >
                <Space direction="vertical" size={2}>
                  <Avatar
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '256px',
                    }}
                    src="/images/product-default-img.png"
                    alt="Store Location"
                  />
                  <Text
                    style={{
                      fontWeight: 800,
                      fontSize: '16px',
                      marginTop: '8px',
                    }}
                  >
                    Add product picture
                  </Text>
                  <Text style={{ fontSize: '12px' }}>must be 1080x1080 px</Text>
                </Space>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              formatter={(value) => `$ ${value}`}
              style={{ width: '150px' }}
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name={['category', 'id']}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...categorySelectProps} />
          </Form.Item>
          <Form.Item label="Active" name="isActive">
            <Radio.Group>
              <Radio value={true}>Enable</Radio>
              <Radio value={false}>Disable</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Edit>
    </Drawer>
  )
}
