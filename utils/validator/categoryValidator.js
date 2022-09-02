const { check } = require("express-validator");
const validatorMW = require("../../middleware/validatorMiddleware");

// @desc validation get category by id
exports.getCategoryRules = [
  check("id").isMongoId().withMessage("category id is not exists"),
  validatorMW,
];

// @desc validation create new category

exports.createCategoryRules = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 3 })
    .withMessage("name of category too short")
    .isLength({ max: 32 })
    .withMessage("name of category too long"),
  validatorMW,
];

// @desc validation update category name by id

exports.updateCategoryRules = [
  check("id").isMongoId().withMessage("category id is not exists"),
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 3 })
    .withMessage("name of category too short")
    .isLength({ max: 32 })
    .withMessage("name of category too long"),
  validatorMW,
];

// @desc validation delete category by id
exports.deleteCategoryRules = [
  check("id").isMongoId().withMessage("category if is not exists"),
  validatorMW,
];
