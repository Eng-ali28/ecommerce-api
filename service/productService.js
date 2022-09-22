const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
const factory = require("./factoryHandler");
const { mongoose } = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
// @desc    create new product
// @route   POST /api/v1/products/
// @access  Private

exports.imagesProcessor = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const fileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    req.body.images = [];
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${fileName}`);
    req.body.imageCover = fileName;
  }
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (image, ind) => {
        const fileName2 = `product-${uuidv4()}-${Date.now()}-${ind}.jpeg`;
        await sharp(image.buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName2}`);
        req.body.images.push(`${fileName2}`);
      })
    );
  }
  next();
});
exports.createProduct = factory.createOne(Product);

// @desc    get all product
// @route   GET /api/v1/products/
// @access  Public

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const countDocument = await Product.countDocuments();
  const ApiFeature = new ApiFeatures(Product.find(), req.query)
    .paginate(countDocument)
    .filteration()
    .sorting()
    .limiting()
    .seraching();
  const { mongooseQuery, paginationResult } = ApiFeature;
  const products = await mongooseQuery.populate({
    path: "category",
    select: "name -_id",
  });
  if (!products) {
    return next(new ApiError("there are not any product !"));
  }
  res
    .status(200)
    .json({ result: products.length, ...paginationResult, data: products });
});

// @desc    get specific product
// @route   GET /api/v1/products/:id
// @access  Public

exports.getSpecificProduct = factory.getOne(Product);

// @desc    upadate product
// @route   PUT /api/v1/products/:id
// @access  Private

exports.updateProduct = factory.updateOne(Product);

// @desc    delete product
// @route   /api/v1/products/:id
// @access  Private

exports.deleteProduct = factory.deleteOne(Product);
