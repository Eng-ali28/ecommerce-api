const Brand = require("../models/brandsModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");
//@desc get all brands
//@route GET /api/v1/categroies?page=x&limit=x
//@access Pubilc
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit;
  const listbrands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ resutl: listbrands.length, listbrands });
});
//@desc     get brand by id
//@route    /api/v1/brands/:id
//@access   Public

exports.getbrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`brand with this id : ${id} not exists`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    create new brand
// @route   POST /api/v1/brands
// @access  private

exports.createbrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  let documentbrand = await Brand.create({
    name,
    slug: slugify(name),
  });
  if (!documentbrand) {
    return next(new ApiError("your create brand faild", 500));
  }
  res.status(201).json({ msg: "success create", documentbrand });
});

// @desc    update brand
// @route   PUT /api/v1/brands/:id
// @access  private

exports.updatebrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`faild update brand with this id ${id}`, 400));
  }
  res.status(200).json({ data: brand });
});

// @desc    delete brand by id
// @route   DELETE api/v1/brands/:id
// @access  Private

exports.deletebrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`cant not delete brand with this id ${id}`, 400));
  }
  res.status(204).json({ msg: "Delete success", result: brand });
});
