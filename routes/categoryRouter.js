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

router.route("/").get(addCategory).post(createCategoryRules, createCategory);
router
  .route("/:id")
  .get(getCategoryRules, getCategoryById)
  .put(updateCategoryRules, updateCategory)
  .delete(deleteCategoryRules, deleteCategory);
module.exports = router;
