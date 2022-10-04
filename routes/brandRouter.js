const router = require("express").Router();
const {
  getbrandRules,
  createbrandRules,
  updatebrandRules,
  deletebrandRules,
} = require("../utils/validator/brandValidator");
const {
  getBrands,
  createbrand,
  getbrandById,
  updatebrand,
  deletebrand,
  imageProcessor,
} = require("../service/brandServices");
const { protect, getRoles } = require("../service/authService");
const { uploadSingleImage } = require("../middleware/uploadImage");
// const subbrandRoute = require("./subbrandRouter");

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    getRoles("admin", "manager"),
    uploadSingleImage("image"),
    imageProcessor,
    createbrandRules,
    createbrand
  );
// router.use("/:brandId/subcategories", subbrandRoute);
router
  .route("/:id")
  .get(getbrandRules, getbrandById)
  .put(protect, getRoles("admin", "manager"), updatebrandRules, updatebrand)
  .delete(protect, getRoles("admin"), deletebrandRules, deletebrand);
module.exports = router;
