const router = require("express").Router();
const {
  createCoupon,
  getAllCoupons,
  getSpecificCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../service/couponService");
const { protect, getRoles } = require("../service/authService");

router.use(protect, getRoles("admin"));
router.route("/").get(getAllCoupons).post(createCoupon);
router
  .route("/:id")
  .get(getSpecificCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
