const validatorMW = require("../../middleware/validatorMiddleware");
const { check } = require("express-validator");
const slugify = require("slugify");
// @desc validat for create subcategory
exports.createSubCategoryValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name is too short")
    .isLength({ max: 32 })
    .withMessage("name is too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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

// @desc validat update subcategory
exports.updateSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id !")
    .notEmpty()
    .withMessage("Id can not be empty"),
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name can not be empty")
    .isLength({ min: 2 })
    .withMessage("name is too short !")
    .isLength({ max: 32 })
    .withMessage("name is too long !")
    .custom((val, { req }) => {
      if (!req.body.name) {
        return Promise.reject("name is required !");
      }
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category can not be empty")
    .isMongoId()
    .withMessage("Invalid id !"),
  validatorMW,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id !"),
  validatorMW,
];
