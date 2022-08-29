const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "you must to add your name"],
      minLength: [3, "Too few letters"],
      maxLength: [32, "Too many letters"],
      unique: [true, "category must be unique, it's exists"],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("category", CategorySchema);
