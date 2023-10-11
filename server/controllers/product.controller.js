import Product from '../mongodb/models/Product.js'
import Category from '../mongodb/models/Category.js'

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

/**************** GET ALL ***************/
const getAllProducts = async (req, res) => {
  const { _end, _order, _start, _sort } = req.query
  const query = {}

  try {
    const count = await Product.countDocuments({ query })

    const products = await Product.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order })
      .populate('category')

    res.header('x-total-count', count)
    res.header('Access-Control-Expose-Headers', 'x-total-count')

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
/**************** GET ID ***************/
const getProductDetail = async (req, res) => {
  const { id } = req.params
  const productExists = await Product.findOne({ _id: id }).populate('creator')

  if (productExists) {
    res.status(200).json(productExists)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}

/**************** CREATE ***************/
const createProduct = async (req, res) => {
  try {
    const { name, isActive, description, images, createdAt, price, category } =
      req.body

    const categoryDoc = await Category.findOne({ id: category.id })

    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' })
    }

    const product = await Product.create({
      name,
      isActive,
      description,
      images,
      createdAt,
      price,
      category: categoryDoc._id,
    })

    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**************** UPDATE ***************/
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, productType, location, price, photo } = req.body

    const photoUrl = await cloudinary.uploader.upload(photo)

    await Product.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        productType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    )

    res.status(200).json({ message: 'Product updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
/**************** DELETE ***************/
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const productToDelete = await Product.findById({ _id: id }).populate(
      'creator'
    )

    if (!productToDelete) throw new Error('Product not found')

    const session = await mongoose.startSession()
    session.startTransaction()

    await productToDelete.deleteOne({ session }) // Použití deleteOne místo remove

    productToDelete.creator.allProducts.pull(productToDelete)

    await productToDelete.creator.save({ session })
    await session.commitTransaction()

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export {
  getAllProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
}
