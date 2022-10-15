const router = require("express").Router({ mergeParams: true });
const {
  createReview,
  getAllReviews,
  getSpecificReview,
  updateSpecificReview,
  deleteSpecificReview,
  getProductId,
  createMW,
} = require("../service/reviewService");
const {
  createVal,
  getSpecificReviewVal,
  updateVal,
  deleteVal,
} = require("../utils/validator/reviewValidator");
const { protect, getRoles } = require("../service/authService");
router
  .route("/")
  .get(getProductId, getAllReviews)
  .post(protect, getRoles("user"), createMW, createVal, createReview);
router
  .route("/:id")
  .get(protect, getSpecificReviewVal, getSpecificReview)
  .put(protect, getRoles("user"), updateVal, updateSpecificReview)
  .delete(protect, getRoles("user", "admin"), deleteVal, deleteSpecificReview);
module.exports = router;
