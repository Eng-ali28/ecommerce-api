const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({ msg: "success add to wishlist", data: data.wishlist });
});
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.wishlist.length == 0) {
    return next(new ApiError("there aren't any favoutrite product.", 400));
  }
  res
    .status(200)
    .json({
      msg: "success",
      result: user.wishlist.length,
      wishlist: user.wishlist,
    });
});
exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res
    .status(204)
    .json({ msg: "success delete product from wishlist", data: user.wishlist });
});
