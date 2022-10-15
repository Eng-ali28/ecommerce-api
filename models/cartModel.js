const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema(
  {
    cartItem: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
        color: String,
        priceOfOne: Number,
        allPrice: Number,
      },
    ],
    totalPrice: { type: Number, default: 0 },
    totalPriceAfterDiscount: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
cartSchema.statics.getTotalPrice = async function (userId) {
  const data = await this.aggregate([
    { $match: { user: userId } },
    { $unwind: "$cartItem" },
    { $project: { "cartItem.allPrice": 1 } },
    { $group: { _id: null, total: { $sum: "$cartItem.allPrice" } } },
    { $project: { _id: 0 } },
  ]);
  const carts = await this.findOneAndUpdate(
    { user: userId },
    { totalPrice: data[0].total },
    { new: true }
  );
  return data;
};
cartSchema.post("save", async function () {
  const result = await this.constructor.getTotalPrice(this.user);
  this.totalPrice = result[0].total;
});
module.exports = mongoose.model("cart", cartSchema);
