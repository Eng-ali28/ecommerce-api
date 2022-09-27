const { check } = require("express-validator");
const validatorMW = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name is too short")
    .isLength({ max: 32 })
    .withMessage("name is too long"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email is exists, please login");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be 8 or more chracters"),
  check("confirmpassword")
    .notEmpty()
    .withMessage("please confirm you password")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("password not confirmed");
      }
      return true;
    }),
  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone("ar-SY")
    .withMessage("phone must be syrian number"),
  validatorMW,
];

exports.loginValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password is too short")
    .isLength({ max: 32 })
    .withMessage("password is too long"),
  validatorMW,
];
