const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./factoryHandler");
const sharp = require("sharp");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
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
  user.passwordChangeTime = Date.now();
  const updateUser = await user.save();
  if (!updateUser) {
    next(new ApiError("password not updated", 400));
  }
  res.status(200).json({ msg: "password updated", resutl: updateUser });
});

// get logged user data

// @ desc get logged user data by req.user._id
// @ route PUT api/v1/loggeduser/getInfo
// @ access Private

exports.getLoggedUserInfo = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc update password logged user
// @route PATCH api/v1/loggeduser/updatepassword
// @access PRIVATE/PROTECT
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  const user = await User.findOne({ _id: req.user._id });
  user.password = newPassword;
  const token = generateToken({ userId: user._id });
  res.cookie("token", `bearer ${token}`, { httpOnly: true });
  user.passwordChangeTime = Date.now();
  await user.save();
  res.status(200).json({ msg: "success update password", token });
});

// @desc update data for logged user (without password)
// @route PUT api/v1/loggeduser/updatedata
// @access PRIVATE/PROTECT
exports.updateLoggeduserData = asyncHandler(async (req, res, next) => {
  const updateUserData = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  res.status(200).json({ result: updateUserData });
});

// @desc unactive account when delete
// @route DELETE api/v1/loggeduser/deleteaccount
// @access private/protect

exports.deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.active) {
    user.active = false;
    await user.save();
  } else {
    return next(new ApiError("your account is not active.", 400));
  }
  res.status(200).json({ msg: "your accout not active now . " });
});
exports.activateAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user.active) {
    user.active = true;
    await user.save();
  } else {
    return next(new ApiError("your account active .", 400));
  }
  res.status(200).json({ msg: "your accout active now . " });
});

// add address (street , city , country , zipcode)

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        address: {
          street: req.body.street,
          city: req.body.city,
          country: req.body.country,
          postalCode: req.body.postalCode,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({ user });
});
// get user addresses
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ addresses: user.address });
});
// delete address
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { address: { _id: addressId } },
  });
  if (!user) {
    return next(
      new ApiError(`there aren't any address with this ${addressId}`, 400)
    );
  }
  res.status(204).json({});
});
