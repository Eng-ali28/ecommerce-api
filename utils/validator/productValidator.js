const { check } = require("express-validator");
const validtorMW = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const slugify = require("slugify");
exports.createProductVM = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("title can not be empty")
    .isLength({ min: 3 })
    .withMessage("title is too short")
    .isLength({ max: 320 })
    .withMessage("title is too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description can not be empty")
    .isLength({ min: 6 })
    .withMessage("description is too short")
    .isLength({ max: 2000 })
    .withMessage("description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity can not be empty")
    .isNumeric()
    .withMessage("quantity can not be string"),
  check("sold").optional().isNumeric().withMessage("sold can not be string"),
  check("price")
    .trim()
    .notEmpty()
    .withMessage("price can not be empty")
    .isNumeric()
    .withMessage("price can not be string")
    .isLength({ max: 20 })
    .withMessage("price is too long")
    .toFloat(),
  check("priceAfterDiscount")
    .optional()
    .trim()

    .isNumeric()
    .withMessage("priceAfterDiscount can not be string")
    .custom((value, { req }) => {
      if (req.body.price < value) {
        return Promise.reject(
          new Error(
            "price before discount can not be more than price after discount"
          )
        );
      }
      return true;
    })
    .toFloat(),
  check("colors").optional(),
  check("imageCover").optional(),
  check("images").optional(),
  check("category")
    .notEmpty()
    .withMessage("category can not be empty")
    .isMongoId()
    .withMessage("category has invalid id")
    .custom((categoryId) => {
      return Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`category with this id ${categoryId} not exists`)
          );
        }
      });
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("subCategory has invalid id")
    .custom((subCategoryId, { req }) => {
      return SubCategory.find({
        _id: { $exists: true, $in: subCategoryId },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoryId.length) {
          return Promise.reject(new Error("Invalid sub categories ids !"));
        }
        return true;
      });
    })
    .custom((value, { req }) => {
      let subCategoryId = [];
      return SubCategory.find({ category: req.body.category })
        .then((result) => {
          if (!result) {
            return Promise.reject(new Error("Invalide result !"));
          }
          return subCategoryId.push(...result);
        })
        .then(() => {
          const newArr = subCategoryId.map((ele) => ele._id.toString());
          const result = value.every((val) => {
            return newArr.includes(val.toString());
          });
          if (!result) {
            return Promise.reject("sub category not allowed !");
          } else {
            return true;
          }
        });
    }),
  check("brand")
    .trim()
    .optional()
    .isMongoId()
    .withMessage("brand has invalid id"),
  check("averageRating")
    .isNumeric()
    .withMessage("averageRating can not be string")
    .toFloat()
    .isLength({ min: 1 })
    .withMessage("Average rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Average rating must be less than or equal 5.0"),
  check("ratingQuantity")
    .isNumeric()
    .withMessage("averageRating can not be string")
    .toFloat()
    .isLength({ min: 1 })
    .withMessage("quantity rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("quantity rating must be less than or equal 5.0"),
  validtorMW,
];

exports.updateProductVM = [
  check("id").isMongoId().withMessage("product has invalid id "),
  check("priceAfterDiscount").custom((value, { req }) => {
    if (req.body.price < value) {
      console.log(value, req.body.price);
      return Promise.reject(
        new Error("error price less than price after discount")
      );
    }
    return true;
  }),
  check("category").custom((categoryId) => {
    return Category.findById(categoryId).then((category) => {
      if (!category) {
        return Promise.reject(
          new Error(`category with this id ${categoryId} not exists`)
        );
      }
    });
  }),
  check("title").custom((val, { req }) => {
    if (!req.body.title) {
      return Promise.reject("title is required !");
    }
    req.body.slug = slugify(val);
    return true;
  }),

  validtorMW,
];

exports.deleteProductVM = [
  check("id").isMongoId().withMessage("product has invalid id "),
  validtorMW,
];
exports.specificProductVM = [
  check("id").isMongoId().withMessage("product has invalid id "),
  validtorMW,
];
