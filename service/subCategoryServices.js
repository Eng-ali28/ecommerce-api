const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/subCategoryModel");
const asyncHanlder = require("express-async-handler");
const slugify = require("slugify");

// @desc    create new subcategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHanlder(async (req, res, next) => {
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

// @desc    get all subcategory & pagination
// @route   GET /api/v1/subcategories?page=x&limit=y
// @access  Public

exports.getAllSubCategories = asyncHanlder(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 1;
  const skip = (page - 1) * limit;
  const subCategories = await SubCategory.find({}).skip(skip).limit(limit);
  if (!subCategories || subCategories.length === 0) {
    return next(new ApiError("There are not any categories", 404));
  }
  res.status(200).json({ result: subCategories.length, data: subCategories });
});

// @desc    get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Pubilc
exports.getSpecificSubCategories = asyncHanlder(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(
      new ApiError(`there are not subcategory with this id : ${id}`, 404)
    );
  }
  res.status(200).json({ data: subCategory });
});
