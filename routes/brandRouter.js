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
} = require("../service/brandServices");
// const subbrandRoute = require("./subbrandRouter");

router.route("/").get(getBrands).post(createbrandRules, createbrand);
// router.use("/:brandId/subcategories", subbrandRoute);
router
  .route("/:id")
  .get(getbrandRules, getbrandById)
  .put(updatebrandRules, updatebrand)
  .delete(deletebrandRules, deletebrand);
module.exports = router;
