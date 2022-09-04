const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: [2, "barnd name too short"],
      maxlength: [32, "brand name too long"],
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("brand", brandSchema);
