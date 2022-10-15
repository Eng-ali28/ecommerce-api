const { check } = require("express-validator");
const ApiError = require("../ApiError");
const validatorMW = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");
exports.addAddressVal = [
  check("street")
    .trim()
    .custom((val, { req }) => {
      return User.findById(req.user._id).then((user) => {
        const resStreet = user.address.find((ele) => {
          if (ele.street == val && ele.city == req.body.city) {
            return true;
          } else {
            return false;
          }
        });
        if (resStreet) {
          return Promise.reject(new ApiError("this address is exists", 400));
        }
      });
    }),
    check("postalCode").trim().isPostalCode("US").withMessage("invalid postalcode , check your inputs please."),
  validatorMW,
];
