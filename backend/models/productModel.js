import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    text: {
      type: String,
      required: true,
      maxlength: 200,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    date: {
      type: Number,
      required: true,
    },
  },
  { minimize: false, versionKey: false },
);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
