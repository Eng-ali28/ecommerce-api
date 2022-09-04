const router = require("express").Router();
const {
  getCategoryRules,
  createCategoryRules,
  updateCategoryRules,
  deleteCategoryRules,
} = require("../utils/validator/categoryValidator");
const {
  addCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../service/categoryService");
const subCategoryRoute = require("./subCategoryRouter");

router.route("/").get(addCategory).post(createCategoryRules, createCategory);
router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/:id")
  .get(getCategoryRules, getCategoryById)
  .put(updateCategoryRules, updateCategory)
  .delete(deleteCategoryRules, deleteCategory);
module.exports = router;
