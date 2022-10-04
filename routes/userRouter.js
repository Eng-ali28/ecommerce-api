const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  imageProcessor,
  updatePassword,
} = require("../service/userService");
const { protect, getRoles } = require("../service/authService");
const { uploadSingleImage } = require("../middleware/uploadImage");
const {
  createValidator,
  getValidator,
  updateValidator,
  deleteValidator,
  updatePasswordValidator,
} = require("../utils/validator/userValidator");
router.use(protect, getRoles("admin"));
router
  .route("/")
  .get(getUsers)
  .post(
    uploadSingleImage("profileImage"),
    imageProcessor,
    createValidator,
    createUser
  );
router
  .route("/:id")
  .get(getValidator, getUserById)
  .put(updateValidator, updateUser)
  .delete(deleteValidator, deleteUser);
router.patch(
  "/:id/updatepassword",

  updatePasswordValidator,
  updatePassword
);
module.exports = router;
