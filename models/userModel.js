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
      minlength: [8, "password too short !"],
    },
    passwordChangeTime: { type: Date, default: 0 },
    passwordResetCode: String,
    passwordResetExpire: Date,
    passwordResetVerfiy: Boolean,
    active: {
      type: Boolean,
      default: true,
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
  if (!this.isModified("password")) {
    console.log("hello from modefied");
    return next();
  }
  const hashPassword = await bcrypt.hash(this.password, 12);
  console.log("hello from not modefied");
  this.password = hashPassword;
  next();
});
module.exports = mongoose.model("user", userSchema);
