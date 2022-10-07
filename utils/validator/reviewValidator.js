const { check } = require("express-validator");
const validatorMW = require("../../middleware/validatorMiddleware");
const Review = require("../../models/reviewModel");
const ApiError = require("../ApiError");

exports.createVal = [
  check("content").optional(),
  check("evaluation")
    .notEmpty()
    .withMessage("evaluation value can't be empty.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("evaluation value between 1.0 and 5.0."),
  check("user")
    .notEmpty()
    .withMessage("user id is required.")
    .isMongoId()
    .withMessage("Invalid user id"),
  check("product")
    .notEmpty()
    .withMessage("product id is required.")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        $and: [{ user: req.user._id }, { product: req.body.product }],
      });
      if (review) {
        return Promise.reject(
          new ApiError("user can put review ont time on the same product", 400)
        );
      }
      return true;
    }),
  validatorMW,
];

exports.getSpecificReviewVal = [
  check("id").isMongoId().withMessage("Invalid id"),
  validatorMW,
];

exports.updateVal = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(
          new ApiError("review with this id not exists", 400)
        );
      }
      if (review.user.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new ApiError("you can update your specific review only.", 400)
        );
      }
      return true;
    }),
  validatorMW,
];

exports.deleteVal = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(
          new ApiError("review with this id not exists", 400)
        );
      }
      if (req.user.role !== "user") {
        return true;
      }
      if (review.user.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new ApiError("you can delete your specific review only.", 400)
        );
      }
      return true;
    }),
  validatorMW,
];
