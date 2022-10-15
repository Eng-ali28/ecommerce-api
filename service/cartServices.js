const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
// @desc    add product to cart
// @route   POST api/v1/cart
// @access  Private/user

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  //get cart to show if there are cart or no
  let cart = await Cart.findOne({ user: req.user._id });
  //get product to get price
  const product = await Product.findById(productId);
  if (!cart) {
    //1) create new cart
    cart = await Cart.create({
      cartItem: [
        {
          product: productId,
          color,
          quantity,
          priceOfOne: product.price,
          allPrice: quantity * product.price,
        },
      ],
      user: req.user._id,
    });
  } else {
    //cart exists, check if product exists
    const productIndex = cart.cartItem.findIndex(
      (ele) =>
        ele.product.toString() === productId.toString() && ele.color === color
    );
    if (productIndex > -1) {
      cart.cartItem[productIndex].quantity += req.body.quantity || 1;
      cart.cartItem.forEach(
        (ele) => (ele.allPrice = ele.quantity * ele.priceOfOne)
      );
    } else {
      cart.cartItem.push({
        product: productId,
        color,
        quantity,
        priceOfOne: product.price,
        allPrice: quantity * product.price,
      });
    }
  }
  await cart.save();
  res.status(200).json({ data: cart });
});

// @desc    get logged user cart
// @route   GET api/v1/cart
// @access  Private/user

exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there aren't any product in your cart", 404));
  }
  await cart.save();
  res.status(200).json({ cartLength: cart.cartItem.length, data: cart });
});

// @desc    delete product from cart
// @route   DELETE api/v1/cart/itemId
// @access  Private/user

exports.deleteItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItem: { _id: itemId } },
    },
    { new: true }
  );
  await cart.save();
  res.status(200).json({ msg: "success delete", data: cart });
});

// @desc    delete user's cart
// @route   DELETE api/v1/cart/
// @access  Private/user

exports.deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndRemove({ user: req.user._id });
  res.status(204).send({});
});

// @desc    update quantity of item
// @route   PUT api/v1/cart/itemId
// @access  Private/user

exports.updateQuantity = asyncHandler(async (req, res, next) => {
  //1) get quantity from body
  const { quantity } = req.body;
  //2) get cart with userID
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user.", 404));
  }
  //3) get correct index from cartItems with findIndex
  const indexItem = cart.cartItem.findIndex(
    (ele) => ele._id.toString() == req.params.itemId
  );
  //4) update quantity && all price
  cart.cartItem[indexItem].quantity = quantity;
  cart.cartItem[indexItem].allPrice =
    quantity * cart.cartItem[indexItem].priceOfOne;
  //5) cart.save() for trigger post middleware and change total price
  await cart.save();
  res.status(201).json({ msg: "success update", data: cart });
});

// @desc    add coupon to cart
// @route   patch api/v1/cart/applyCoupon
// @access  Private/user

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  //1) get coupon by name from body
  const { name } = req.body;
  const coupon = await Coupon.findOne({
    name: name,
    expire: { $gt: Date.now() },
  });
  //2) check if coupon is valid
  if (!coupon) {
    return next(new ApiError("this coupon is invalide or expired", 400));
  }
  //3) get discount and set in variable
  const discount = coupon.discount;
  //4) get cart by userId
  const cart = await Cart.findOne({ user: req.user._id });
  //5) get total price and and set new value in price after discount
  const { totalPrice } = cart;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({ status: "coupon applied", data: cart });
});
