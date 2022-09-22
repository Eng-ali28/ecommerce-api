const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");
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
exports.createSubCategory = factory.createOne(SubCategory);
// middleware for nested route to catch params and put it in body
exports.getCategorymw = (req, res, next) => {
  if (req.params.categoryId) {
    req.filterObj = { category: req.params.categoryId };
  }
  next();
};
// @desc    get all subcategory & pagination
// @route   GET /api/v1/subcategories?page=x&limit=y
// @access  Public

exports.getAllSubCategories = factory.getAll(SubCategory);
// @desc    get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Pubilc
exports.getSpecificSubCategories = factory.getOne(SubCategory);

// @desc    update subcategory by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private

exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    delete subCategory By id
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
