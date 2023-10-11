import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema({
  uid: String,
  lastModified: Number,
  lastModifiedDate: String,
  name: String,
  size: Number,
  type: String,
  percent: Number,
  originFileObj: {
    uid: String
  },
  status: String,
  response: String,
  xhr: Object,
  thumbUrl: String
}, { _id : false });

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive:  { type: Boolean, required: true, default: true },
    images: [ImageSchema], // Change this line
    createdAt: { type: Date, required: true, default: Date.now },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
)

const productModel = mongoose.model('Product', ProductSchema)

export default productModel
