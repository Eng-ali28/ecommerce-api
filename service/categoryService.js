const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");
//@desc get all categories
//@route GET /api/v1/categroies?page=x&limit=x
//@access Pubilc
exports.addCategory = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit;
  const listCategories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ resutl: listCategories.length, listCategories });
});
//@desc     get category by id
//@route    /api/v1/categories/:id
//@access   Public

exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`category with this id : ${id} not exists`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    create new category
// @route   POST /api/v1/categories
// @access  private

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  let documentCategory = await Category.create({
    name,
    slug: slugify(name),
  });
  if (!documentCategory) {
    return next(new ApiError("your create category faild", 500));
  }
  res.status(201).json({ msg: "success create", documentCategory });
});

// @desc    update category
// @route   PUT /api/v1/categories/:id
// @access  private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`faild update category with this id ${id}`, 400));
  }
  res.status(200).json({ data: category });
});

// @desc    delete category by id
// @route   DELETE api/v1/categories/:id
// @access  Private

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(
      new ApiError(`cant not delete category with this id ${id}`, 400)
    );
  }
  res.status(204).json({ msg: "Delete success", result: category });
});
