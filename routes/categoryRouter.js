const router = require("express").Router();

const {
  addCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../service/categoryService");

router.route("/").get(addCategory).post(createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);
module.exports = router;
