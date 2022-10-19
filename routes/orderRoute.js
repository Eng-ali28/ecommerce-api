const router = require("express").Router();
const {
  createOrder,
  getAllOrders,
  getSpecificOrder,
  updateDelever,
  updatePay,
  checkout,
} = require("../service/orderService.js");
const { protect, getRoles } = require("../service/authService.js");
router.post("/checkout-session/:cartId", protect, getRoles("user"), checkout);
router.route("/:cartId").post(protect, getRoles("user"), createOrder);
router.get("/", protect, getRoles("user", "admin"), getAllOrders);
router.get("/:id", protect, getRoles("admin"), getSpecificOrder);
router.patch("/:orderId/pay", protect, getRoles("admin"), updatePay);
router.patch("/:orderId/delever", protect, getRoles("admin"), updateDelever);
module.exports = router;
