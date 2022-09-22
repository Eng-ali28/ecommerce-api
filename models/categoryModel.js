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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
function setImageUrl(doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/category/${doc.image}`;
  }
}
CategorySchema.post("init", (doc) => setImageUrl(doc));
CategorySchema.post("save", (doc) => setImageUrl(doc));
module.exports = mongoose.model("category", CategorySchema);
