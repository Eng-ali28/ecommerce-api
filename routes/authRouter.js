const router = require("express").Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validator/authValidator");
const { signup, login } = require("../service/authService");
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
module.exports = router;
