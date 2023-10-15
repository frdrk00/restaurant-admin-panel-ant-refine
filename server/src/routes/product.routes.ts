import express from 'express'

import {
  createProduct,
  deleteAllProducts,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
} from '../controllers/product.controller'

const router = express.Router()

router.route('/').post(createProduct)
router.route('/').get(getProducts)
router.route('/:id').get(getProduct)
router.route('/:id').patch(updateProduct)
router.route('/:id').delete(deleteProduct)
router.route('/').delete(deleteAllProducts)

export default router
