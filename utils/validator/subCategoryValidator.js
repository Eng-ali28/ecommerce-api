const validatorMW = require("../../middleware/validatorMiddleware");
const { check } = require("express-validator");

// @desc validat for create subcategory
exports.createSubCategoryValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name is too short")
    .isLength({ max: 32 })
    .withMessage("name is too long"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("category has invalid id"),
  validatorMW,
];

// @desc validat get specific subcategory
exports.getSpecificSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid id !")
    .notEmpty()
    .withMessage("id cant not be empty"),
  validatorMW,
];
