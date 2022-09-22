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
  upload,
  categoryImage,
} = require("../service/categoryService");
const { uploadSingleImage } = require("../middleware/uploadImage");
const subCategoryRoute = require("./subCategoryRouter");

router
  .route("/")
  .get(addCategory)
  .post(
    uploadSingleImage("image"),
    categoryImage,
    createCategoryRules,
    createCategory
  );
router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/:id")
  .get(getCategoryRules, getCategoryById)
  .put(
    uploadSingleImage("image"),
    categoryImage,
    updateCategoryRules,
    updateCategory
  )
  .delete(deleteCategoryRules, deleteCategory);
module.exports = router;
