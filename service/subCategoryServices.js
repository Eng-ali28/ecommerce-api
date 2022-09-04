const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
//middleware to catch categoryId from params and put it in body for validation layer
exports.createSubcategoryMW = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};
// @desc    create new subcategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  if (!subCategory) {
    return next(new ApiError(400, "subCategory faild created"));
  }
  res.status(201).json({ msg: "success created", data: subCategory });
});
// middleware for nested route to catch params and put it in body
exports.getCategorymw = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};
// @desc    get all subcategory & pagination
// @route   GET /api/v1/subcategories?page=x&limit=y
// @access  Public

exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 1;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find({ category: req.body.category })
    .skip(skip)
    .limit(limit);
  if (!subCategories || subCategories.length === 0) {
    return next(new ApiError("There are not any categories", 404));
  }
  res
    .status(200)
    .json({ result: subCategories.length, page, data: subCategories });
});

// @desc    get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Pubilc
exports.getSpecificSubCategories = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(
      new ApiError(`there are not subcategory with this id : ${id}`, 404)
    );
  }
  res.status(200).json({ data: subCategory });
});

// @desc    update subcategory by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError("something went error , faild update !", 400));
  }
  res.status(203).json({ msg: "success update", data: subCategory });
});

// @desc    delete subCategory By id
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError("something went error , faild delete", 400));
  }
  res.status(204).json({ msg: "success delete", data: subCategory });
});
