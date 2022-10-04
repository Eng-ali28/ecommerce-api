const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createSubCategory,
  getAllSubCategories,
  getSpecificSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getCategorymw,
  createSubcategoryMW,
} = require("../service/subCategoryServices");
const {
  createSubCategoryValidator,
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");
const { protect, getRoles } = require("../service/authService");
router
  .route("/")
  .post(
    protect,
    getRoles("admin", "manager"),
    createSubcategoryMW,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(getCategorymw, getAllSubCategories);
router
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategories)
  .put(
    protect,
    getRoles("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    getRoles("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
