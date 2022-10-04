const { check } = require("express-validator");
const validationResultMW = require("../../middleware/validatorMiddleware");
const ApiError = require("../ApiError");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const { default: slugify } = require("slugify");
exports.createValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name can't be empty")
    .isLength({ min: 3 })
    .withMessage("name is too short"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("email can't be empty")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        console.log(user);
        if (user) {
          return Promise.reject("E-mail has exists");
        }
        return true;
      });
    }),
  check("phone")
    .notEmpty()
    .withMessage("phone can't be empty")
    .isMobilePhone(["ar-SY"])
    .withMessage("Ivalid syrian number"),
  check("password")
    .notEmpty()
    .withMessage("password can't be empty")
    .isLength({ min: 6 })
    .withMessage("password must be 6 or more charactares")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Not confirmed password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password can't be empty"),
  check("profileImage").optional(),
  check("role").optional(),
  validationResultMW,
];

exports.getValidator = [
  check("id").isMongoId().withMessage("Invalid id "),
  validationResultMW,
];

exports.updateValidator = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validationResultMW,
];
exports.deleteValidator = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validationResultMW,
];

exports.updatePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid id!"),
  check("oldpassword")
    .notEmpty()
    .withMessage("oldpassword can't be empty")
    .custom(async (oldPassword, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`user  with this id : ${req.params.id} not found`);
      }
      const result = await bcrypt.compare(oldPassword, user.password);
      if (result) {
        return true;
      } else {
        throw new Error("old password not correct.");
      }
    }),
  check("newpassword")
    .notEmpty()
    .withMessage("New passsword can't be empty.")
    .isLength({ min: 6 })
    .withMessage("New password is too short")
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.confirmNewPassword) {
        throw new Error("new password not confirmed !");
      }
      req.newPassword = newPassword;
      return true;
    }),
  check("confirmNewPassword").notEmpty().withMessage("can't be empty"),
  validationResultMW,
];

// logged user
exports.updateLoggedUserVal = [
  check("name")
    .trim()
    .optional()
    .isLength({ min: 2 })
    .withMessage("name is too short")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .trim()
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        if (user) {
          if (user.email == val) {
            return Promise.reject("This email is already in use");
          }
          return Promise.reject("E-mail has exists");
        }
        return true;
      });
    }),
  check("phone")
    .trim()
    .optional()
    .isMobilePhone(["ar-SY"])
    .withMessage("Ivalid syrian number"),
  validationResultMW,
];
