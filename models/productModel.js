const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "title too short !"],
      maxlength: [320, "title too long"],
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
      max: [2000000, "price is not allowed"],
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
    imageCover: {
      type: String,
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});
function setUrl(doc) {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images = doc.images.map((image) => {
      return `${process.env.BASE_URL}/products/${image}`;
    });
  }
}
productSchema.post("init", (doc) => setUrl(doc));
productSchema.post("save", (doc) => setUrl(doc));
module.exports = mongoose.model("product", productSchema);
