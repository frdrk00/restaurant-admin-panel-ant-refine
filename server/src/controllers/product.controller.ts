import { db } from '../lib/db'
import { Request, Response } from 'express'

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, isActive, price, category, images, categoryId } =
    req.body

  if (
    !name ||
    !description ||
    isActive === undefined ||
    !price ||
    !images ||
    !category
  ) {
    res.status(400).send('Fields are required')
    return
  }

  try {
    const newProductId = Math.floor(Math.random() * 1000000)

    const product = await db.product.create({
      data: {
        productId: newProductId,
        name,
        description,
        isActive,
        price,
        categoryId: category.id,
        images: {
          create: {
            response: images[0].response,
          },
        },
      },
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('PRODUCT_CREATE_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.product.findMany({
      include: {
        categories: true,
        images: true,
      },
    })

    res.json(products)
  } catch (error) {
    console.error('PRODUCT_GET_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    })

    if (!product) {
      res.status(404).send('Product not found')
      return
    }

    res.json(product)
  } catch (error) {
    console.error('PRODUCT_GET_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, isActive, price, category, images, categoryId } =
    req.body

  if (
    !name ||
    !description ||
    isActive === undefined ||
    !price ||
    !category ||
    !images ||
    !categoryId
  ) {
    res.status(400).send('Fields are required')
    return
  }

  try {
    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        isActive,
        price,
        category: category.id,
        categories: {
          connect: {
            id: categoryId,
          },
        },
        images: {
          create: {
            response: images.response,
          },
        },
      },
    })

    res.json(product)
  } catch (error) {
    console.error('PRODUCT_UPDATE_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await db.product.delete({
      where: { id },
    })

    res.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('PRODUCT_DELETE_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const deleteAllProducts = async (req: Request, res: Response) => {
  try {
    await db.product.deleteMany()

    res.json({ message: 'All products deleted' })
  } catch (error) {
    console.error('PRODUCT_DELETE_ALL_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}
