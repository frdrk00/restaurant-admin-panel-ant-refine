import { db } from '../lib/db'
import { Request, Response } from 'express'

export const createCategory = async (req: Request, res: Response) => {
  const { title, isActive } = req.body

  if (!title || isActive === undefined) {
    res.status(400).send('Field are required')
    return
  }

  try {
    const newCategoryId = Math.floor(Math.random() * 1000000)

    const category = await db.category.create({
      data: {
        categoryId: newCategoryId,
        title,
        isActive,
      },
    })

    res.status(201).json(category)
  } catch (error) {
    console.error('CATEGORY_CREATE_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const getCategories = async (req: Request, res: Response) => {
try {
    const count = await db.category.count();

    const categories = await db.category.findMany({
      where: {
        isActive: true,
      }
    });

    res.header("x-total-count", count.toString());
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(categories);
  } catch (error) {
    console.error('CATEGORY_GET_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const category = await db.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })

    if (!category) {
      res.status(404).send('Category not found')
      return
    }

    res.json(category)
  } catch (error) {
    console.error('CATEGORY_GET_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, isActive } = req.body

  if (!title || isActive === undefined) {
    res.status(400).send('Field are required')
    return
  }

  try {
    const category = await db.category.update({
      where: { id },
      data: {
        title,
        isActive,
      },
    })

    res.json(category)
  } catch (error) {
    console.error('CATEGORY_UPDATE_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await db.category.delete({
      where: { id },
    })

    res.json({ message: 'Category deleted' })
  } catch (error) {
    console.error('CATEGORY_DELETE_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}

export const deleteAllCategories = async (req: Request, res: Response) => {
  try {
    await db.category.deleteMany()

    res.json({ message: 'All categories deleted' })
  } catch (error) {
    console.error('CATEGORY_DELETE_ALL_ERROR', error)
    res.status(500).send('Something went wrong')
  }
}
