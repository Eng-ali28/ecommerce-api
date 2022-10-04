const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
  upload,
  imagesProcessor,
} = require("../service/productService");
const {
  createProductVM,
  specificProductVM,
  updateProductVM,
  deleteProductVM,
} = require("../utils/validator/productValidator");
const { protect, getRoles } = require("../service/authService");
const { uploadMixImages } = require("../middleware/uploadImage");
router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    getRoles("admin", "manager"),
    uploadMixImages([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ]),
    imagesProcessor,
    createProductVM,
    createProduct
  );

router
  .route("/:id")
  .get(specificProductVM, getSpecificProduct)
  .put(updateProductVM, updateProduct)
  .delete(deleteProductVM, deleteProduct);

module.exports = router;
