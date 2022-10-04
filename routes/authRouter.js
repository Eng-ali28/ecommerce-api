const router = require("express").Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validator/authValidator");
const {
  signup,
  login,
  logout,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../service/authService");
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/verifycode", verifyResetCode);
router.put("/resetpassword", resetPassword);
module.exports = router;
