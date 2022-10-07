const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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

module.exports = mongoose.model("review", reviewSchema);
