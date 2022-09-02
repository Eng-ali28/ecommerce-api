const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: [2, "name too short !"],
      maxlength: [32, "name too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "category must ne exists"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subCategory", subCategorySchema);
