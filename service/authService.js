const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// @desc signup
// @route POST /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const newUser = await User.create({
    name,
    slug: slugify(name),
    email,
    phone,
    password,
  });
  const token = jwt.sign(
    { name, email, phone, userId: newUser._id },
    process.env.SECRET
  );
  res.status(201).json({ token, result: newUser });
});
// @desc login
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new ApiError("email or password in correct", 401));
  }
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        next(new ApiError("email or password incorrect", 401));
      } else {
        const token = jwt.sign(
          { userId: user._id, name: user.name },
          process.env.SECRET
        );
        res.status(200).json({ result: user, token });
      }
    });
  }
});
