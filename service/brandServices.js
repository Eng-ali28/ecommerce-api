const Brand = require("../models/brandsModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./factoryHandler");
const slugify = require("slugify");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
//@desc get all brands
//@route GET /api/v1/categroies?page=x&limit=x
//@access Pubilc
exports.getBrands = asyncHandler(async (req, res) => {
  const countDocument = await Brand.countDocuments();
  const apiFeature = new ApiFeatures(Brand.find(), req.query)
    .paginate(countDocument)
    .filteration()
    .limiting()
    .seraching()
    .sorting();
  const { mongooseQuery, paginationResult } = apiFeature;
  const listBrands = await mongooseQuery;
  res
    .status(200)
    .json({ resutl: listBrands.length, paginationResult, data: listBrands });
});
//@desc     get brand by id
//@route    /api/v1/brands/:id
//@access   Public

exports.getbrandById = factory.getOne(Brand);

// @desc    create new brand
// @route   POST /api/v1/brands
// @access  private
exports.imageProcessor = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
});
exports.createbrand = factory.createOne(Brand);

// @desc    update brand
// @route   PUT /api/v1/brands/:id
// @access  private

exports.updatebrand = factory.updateOne(Brand);

// @desc    delete brand by id
// @route   DELETE api/v1/brands/:id
// @access  Private

exports.deletebrand = factory.deleteOne(Brand);
