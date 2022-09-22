const Category = require("../models/categoryModel");
const factory = require("./factoryHandler");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const ApiError = require("../utils/ApiError");
const expressHandler = require("express-async-handler");
const sharp = require("sharp");

//@desc get all categories
//@route GET /api/v1/categroies?page=x&limit=x
//@access Pubilc
exports.addCategory = factory.getAll(Category);
//@desc     get category by id
//@route    /api/v1/categories/:id
//@access   Public

exports.getCategoryById = factory.getOne(Category);

// @desc    create new category
// @route   POST /api/v1/categories
// @access  private
exports.categoryImage = expressHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/category/${fileName}`);

  req.body.image = fileName;
  next();
});
exports.createCategory = factory.createOne(Category);

// @desc    update category
// @route   PUT /api/v1/categories/:id
// @access  private

exports.updateCategory = factory.updateOne(Category);

// @desc    delete category by id
// @route   DELETE api/v1/categories/:id
// @access  Private

exports.deleteCategory = factory.deleteOne(Category);
