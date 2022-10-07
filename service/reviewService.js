const asyncHanlder = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./factoryHandler");
const Review = require("../models/reviewModel");
// @desc    create review
// @route   POST api/v1/review/
// @access  Private/Protect
exports.createReview = factory.createOne(Review);
// @desc get all reviews
// @route GET api/v1/review/
// @access PUBLIC
exports.getAllReviews = factory.getAll(Review);
// @desc get specific review
// @route GET api/v1/review/:id
// @access PRIVATE/PROTECT
exports.getSpecificReview = factory.getOne(Review);
// @desc update specific review
// @route PUT api/v1/review/:id
// @access Private/Protect
exports.updateSpecificReview = asyncHanlder(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
  if (!review) {
    return next(new ApiError("review with this id not exists", 404));
  }
  res.status(203).json({ msg: "success update", data: review });
});
// @desc delete specific review
// @route delete api/v1/review/:id
// @access Private/Protect (admin,user)
exports.deleteSpecificReview = factory.deleteOne(Review);
