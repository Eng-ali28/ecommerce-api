const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user information is required"],
    },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
        color: String,
        priceOfOne: Number,
        priceOfAll: Number,
      },
    ],
    totalPriceWithout: Number,
    taxPrice: Number,
    shippingAddress: {
      details: String,
      phone: String,
    },
    shippingPrice: Number,
    totalPriceWith: Number,
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelevered: {
      type: Boolean,
      default: false,
    },
    deleveredAt: Date,
  },
  { timestamps: true }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage phone -_id",
  }).populate({ path: "cartItems.product", select: "title imageCover _id" });
  next();
});
module.exports = mongoose.model("order", orderSchema);
