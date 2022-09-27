const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    slug: String,
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "password too short !"],
      maxlength: [56, "password too long ! "],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
function setImageUrl(doc) {
  if (doc.profileImage) {
    doc.profileImage = `${process.env.BASE_URL}/users/${doc.profileImage}`;
  }
}
userSchema.post("save", (doc) => setImageUrl(doc));
userSchema.post("init", (doc) => setImageUrl(doc));
userSchema.pre("save", async function (next) {
  const hashPassword = await bcrypt.hash(this.password, 12);
  this.password = hashPassword;
  next();
});
module.exports = mongoose.model("user", userSchema);
