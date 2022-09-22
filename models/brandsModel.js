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
function setImageUrl(doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/brands/${doc.image}`;
  }
}
brandSchema.post("init", (doc) => setImageUrl(doc));
brandSchema.post("save", (doc) => setImageUrl(doc));
module.exports = mongoose.model("brand", brandSchema);
