const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "title too short !"],
      maxlength: [32, "title too long"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [16, "description too short"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      maxlength: [20, "price is not allowed"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [
      {
        type: String,
        required: [true, "color is required"],
      },
    ],
    imageCovered: {
      type: String,
      required: [true, "image covered is required"],
    },
    images: [String],
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: "true",
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "subCategory",
        required: [true, "subcategory is required"],
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brand",
    },
    averageRating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    ratingQuantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
