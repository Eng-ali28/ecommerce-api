const router = require("express").Router();
const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishlist,
} = require("../service/wishlistService");
const { protect, getRoles } = require("../service/authService");
router.use(protect, getRoles("user"));
router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);
router.delete("/:productId", deleteProductFromWishlist);
module.exports = router;
