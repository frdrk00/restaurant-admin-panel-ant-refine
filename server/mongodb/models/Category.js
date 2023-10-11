import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, },
    title: { type: String, required: true },
    isActive:  { type: Boolean, required: true, default: true },
    cover: { type: String },
  },
  { timestamps: true }
)

const categoryModel = mongoose.model('Category', CategorySchema)

export default categoryModel
