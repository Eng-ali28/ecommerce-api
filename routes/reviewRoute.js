const router = require("express").Router();
const {
  createReview,
  getAllReviews,
  getSpecificReview,
  updateSpecificReview,
  deleteSpecificReview,
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
  .get(getAllReviews)
  .post(protect, getRoles("user"), createVal, createReview);
router
  .route("/:id")
  .get(protect, getSpecificReviewVal, getSpecificReview)
  .put(protect, getRoles("user"), updateVal, updateSpecificReview)
  .delete(protect, getRoles("user", "admin"), deleteVal, deleteSpecificReview);
module.exports = router;
