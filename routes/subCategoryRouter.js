const express = require("express");
const router = express.Router();
const {
  createSubCategory,
  getAllSubCategories,
  getSpecificSubCategories,
} = require("../service/subCategoryServices");
const {
  createSubCategoryValidator,
  getSpecificSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");

router
  .route("/")
  .post(createSubCategoryValidator, createSubCategory)
  .get(getAllSubCategories);
router
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategories);
module.exports = router;
