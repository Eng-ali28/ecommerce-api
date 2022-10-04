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
  categoryImage,
} = require("../service/categoryService");
const { uploadSingleImage } = require("../middleware/uploadImage");
const subCategoryRoute = require("./subCategoryRouter");
const { protect, getRoles } = require("../service/authService");
router
  .route("/")
  .get(addCategory)
  .post(
    protect,
    getRoles("admin", "manager"),
    uploadSingleImage("image"),
    categoryImage,
    createCategoryRules,
    createCategory
  );
router.use(
  "/:categoryId/subcategories",
  protect,
  getRoles("admin", "manager"),
  subCategoryRoute
);
router
  .route("/:id")
  .get(protect, getRoles("admin", "manager"), getCategoryRules, getCategoryById)
  .put(
    protect,
    getRoles("admin", "manager"),
    uploadSingleImage("image"),
    categoryImage,
    updateCategoryRules,
    updateCategory
  )
  .delete(protect, getRoles("admin"), deleteCategoryRules, deleteCategory);
module.exports = router;
