const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name of coupon is required."],
    },
    expire: {
      type: Date,
      required: [true, "expire coupon date is required."],
    },
    discount: {
      type: Number,
      required: [true, "discount is required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("coupon", couponSchema);
