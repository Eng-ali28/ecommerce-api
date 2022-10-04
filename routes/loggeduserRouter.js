const router = require("express").Router();
const {
  getUserById,
  getLoggedUserInfo,
  updateLoggedUserPassword,
  updateLoggeduserData,
} = require("../service/userService");
const { updateLoggedUserVal } = require("../utils/validator/userValidator");
const { protect } = require("../service/authService");
router.get("/info", protect, getLoggedUserInfo, getUserById);
router.patch("/updatepassword", protect, updateLoggedUserPassword);
router.put("/updatedata", protect, updateLoggedUserVal, updateLoggeduserData);
module.exports = router;
