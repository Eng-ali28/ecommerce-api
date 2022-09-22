const { check } = require("express-validator");
const validatorMW = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
// @desc validation get brand by id
exports.getbrandRules = [
  check("id").isMongoId().withMessage("brand id is not exists"),
  validatorMW,
];

// @desc validation create new brand

exports.createbrandRules = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("brand name is required")
    .isLength({ min: 3 })
    .withMessage("name of brand too short")
    .isLength({ max: 32 })
    .withMessage("name of brand too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMW,
];

// @desc validation update brand name by id

exports.updatebrandRules = [
  check("id").isMongoId().withMessage("brand id is not exists"),
  check("name")
    .notEmpty()
    .withMessage("brand name is required")
    .isLength({ min: 3 })
    .withMessage("name of brand too short")
    .isLength({ max: 32 })
    .withMessage("name of brand too long")
    .custom((val, { req }) => {
      if (!req.body.name) {
        return Promise.reject("name is required !");
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMW,
];

// @desc validation delete brand by id
exports.deletebrandRules = [
  check("id").isMongoId().withMessage("brand if is not exists"),
  validatorMW,
];
