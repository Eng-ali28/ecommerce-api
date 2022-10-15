const Coupon = require("../models/couponModel");
const factory = require("./factoryHandler");
const asyncHandler = require("express-async-handler");

// @desc    create coupon
// @route   POST api/v1/coupons
// @access  Peivate/admin

exports.createCoupon = factory.createOne(Coupon);

// @desc    get all coupons
// @route   GET api/v1/coupons
// @access  Peivate/admin

exports.getAllCoupons = factory.getAll(Coupon);

// @desc    get specific coupon
// @route   GET api/v1/coupons/:id
// @access  Peivate/admin

exports.getSpecificCoupon = factory.getOne(Coupon);

// @desc    update coupon
// @route   PUT api/v1/coupons/:id
// @access  Peivate/admin

exports.updateCoupon = factory.updateOne(Coupon);

// @desc    delete coupon
// @route   DELETE api/v1/coupons/:id
// @access  Peivate/admin

exports.deleteCoupon = factory.deleteOne(Coupon);
