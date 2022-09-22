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
const { uploadSingleImage } = require("../middleware/uploadImage");
// const subbrandRoute = require("./subbrandRouter");

router
  .route("/")
  .get(getBrands)
  .post(
    uploadSingleImage("image"),
    imageProcessor,
    createbrandRules,
    createbrand
  );
// router.use("/:brandId/subcategories", subbrandRoute);
router
  .route("/:id")
  .get(getbrandRules, getbrandById)
  .put(updatebrandRules, updatebrand)
  .delete(deletebrandRules, deletebrand);
module.exports = router;
