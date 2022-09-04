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

router
  .route("/")
  .post(createSubcategoryMW, createSubCategoryValidator, createSubCategory)
  .get(getCategorymw, getAllSubCategories);
router
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategories)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
