const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./factoryHandler");
const sharp = require("sharp");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/ApiError");
//@desc get all users
//@route GET /api/v1/categroies?page=x&limit=x
//@access Pubilc
exports.getUsers = asyncHandler(async (req, res) => {
  const countDocument = await User.countDocuments();
  const apiFeature = new ApiFeatures(User.find(), req.query)
    .paginate(countDocument)
    .filteration()
    .limiting()
    .seraching()
    .sorting();
  const { mongooseQuery, paginationResult } = apiFeature;
  const listUsers = await mongooseQuery;
  res
    .status(200)
    .json({ resutl: listUsers.length, paginationResult, data: listUsers });
});
//@desc     get user by id
//@route    /api/v1/users/:id
//@access   Private

exports.getUserById = factory.getOne(User);

// @desc    create new user
// @route   POST /api/v1/users
// @access  private
exports.imageProcessor = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
  req.body.profileImage = fileName;
  next();
});
exports.createUser = factory.createOne(User);

// @desc    update user
// @route   PUT /api/v1/users/:id
// @access  private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, slug, role } = req.body;
  if (name) {
    req.body.slug = slugify(name);
  }
  const userUpdate = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      phone,
      slug,
      role,
    },
    { new: true }
  );
  res.status(203).json({ msg: "update success", result: userUpdate });
});

// @desc    delete user by id
// @route   DELETE api/v1/users/:id
// @access  Private

exports.deleteUser = factory.deleteOne(User);

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  user.password = req.newPassword;
  const updateUser = await user.save();
  if (!updateUser) {
    next(new ApiError("password not updated", 400));
  }
  res.status(200).json({ msg: "password updated", resutl: updateUser });
});
