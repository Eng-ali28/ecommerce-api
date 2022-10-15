const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./productModel");
const reviewSchema = new Schema(
  {
    content: {
      type: String,
    },
    evaluation: {
      type: Number,
      min: [1, "evaluation range between 1.0 and 5.0 "],
      max: [5, "evaluation range between 1.0 and 5.0 "],
      required: [true, "evaluation is required."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user can't be empty"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: [true, "product can't be empty"],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});
reviewSchema.statics.getAvarageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$evaluation" },
        quantityRate: { $sum: 1 },
      },
    },
  ]);
  await Product.findByIdAndUpdate(
    productId,
    {
      averageRating: result[0].avgRating,
      ratingQuantity: result[0].quantityRate,
    },
    { new: true }
  );
};
reviewSchema.post("save", async function (doc) {
  await this.constructor.getAvarageRatingAndQuantity(this.product);
});
reviewSchema.post("remove", async function () {
  await this.constructor.getAvarageRatingAndQuantity(this.product);
});
module.exports = mongoose.model("review", reviewSchema);
