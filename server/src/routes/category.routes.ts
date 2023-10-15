import express from 'express'

import {
  createCategory,
  getCategories,
  updateCategory,
  getCategory,
} from '../controllers/category.controller'

const router = express.Router()

router.route('/').post(createCategory)
router.route('/').get(getCategories)
router.route('/:id').patch(updateCategory)
router.route('/:id').get(getCategory)

export default router
