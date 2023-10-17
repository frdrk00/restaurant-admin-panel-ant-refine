import { useEffect, useState } from 'react'
import { useList } from '@refinedev/core'
import { Button, Space, Skeleton } from 'antd'

import { ICategory } from '../../interfaces'

type ProductItemProps = {
  value?: string[]
  onChange?: (value: string[]) => void
}

export const ProductCategoryFilter: React.FC<ProductItemProps> = ({
  onChange,
  value,
}) => {
  const [filterCategories, setFilterCategories] = useState<string[]>(
    value ?? []
  )

  useEffect(() => {
    if (filterCategories.length > 0) {
      onChange?.(filterCategories)
    }
    // eslint-disable-next-line
  }, [filterCategories])

  const { data: categoryData, isLoading: categoryIsLoading } =
    useList<ICategory>({
      resource: 'categories',
      config: {
        pagination: { pageSize: 30 },
      },
    })

  const toggleFilterCategory = (clickedCategory: string) => {
    const target = filterCategories.findIndex(
      (category) => category === clickedCategory
    )

    if (target < 0) {
      setFilterCategories((prevCategories) => {
        return [...prevCategories, clickedCategory]
      })
    } else {
      const copyFilterCategories = [...filterCategories]

      copyFilterCategories.splice(target, 1)

      setFilterCategories(copyFilterCategories)
    }

    onChange?.(filterCategories)
  }

  if (categoryIsLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  return (
    <Space wrap>
      <Button
        shape="round"
        type={filterCategories.length === 0 ? 'primary' : 'default'}
        onClick={() => {
          setFilterCategories([])
          onChange?.([])
        }}
      >
        All
      </Button>
      {categoryData?.data.map((category) => (
        <Button
          key={category.categoryId}
          shape="round"
          type={
            filterCategories.includes(category.categoryId.toString())
              ? 'primary'
              : 'default'
          }
          onClick={() => toggleFilterCategory(category.categoryId.toString())}
        >
          {category.title}
        </Button>
      ))}
    </Space>
  )
}
