const router = require("express").Router();
const {
  addAddress,
  deleteAddress,
  getAddresses,
} = require("../service/userService");
const { protect, getRoles } = require("../service/authService");
const { addAddressVal } = require("../utils/validator/addressVal");
router.post("/", protect, getRoles("user"), addAddressVal, addAddress);
router.get("/", protect, getRoles("user"), getAddresses);
router.delete("/:addressId", protect, getRoles("user"), deleteAddress);
module.exports = router;
