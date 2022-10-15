const router = require("express").Router();
const {
  addToCart,
  getCart,
  deleteCart,
  deleteItem,
  updateQuantity,
  applyCoupon,
} = require("../service/cartServices");
const { protect, getRoles } = require("../service/authService");
router.use(protect, getRoles("user"));
router.route("/").post(addToCart).get(getCart).delete(deleteCart);
router.route("/:itemId").put(updateQuantity).delete(deleteItem);
router.patch("/applyCoupon", applyCoupon);
module.exports = router;
