import Category from '../mongodb/models/Category.js'
import * as dotenv from 'dotenv'

dotenv.config()

const getAllCategories = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
} = req.query;
const query = {};

try {
    const count = await Category.countDocuments({ query });

    const products = await Category.find(query)
        .limit(_end)
        .skip(_start)
        .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(products);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

const createCategory = async (req, res) => {
  try {
    const { title, isActive, cover, id } = req.body
    const category = new Category({
      id,
      title,
      isActive,
      cover,
    })

    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getAllCategories, createCategory }
