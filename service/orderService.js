const stripe = require("stripe")(process.env.PAY_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const factory = require("./factoryHandler");
// @desc create new order
// @route POST api/v1/order/cartId
// access Private / user

exports.createOrder = asyncHandler(async (req, res, next) => {
  // app sitting
  const taxPrice = 0;
  const shippingPrice = 0;
  const { cartId } = req.params;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new ApiError("Cart with this id not exists", 404));
  }
  console.log(cart);
  let { totalPrice, isAppliedCoupon } = cart;
  const { product, priceOfOne, allPrice, quantity, color } = cart.cartItem;
  const totalPriceCart = isAppliedCoupon
    ? cart.totalPriceAfterDiscount
    : totalPrice;
  const totalPriceWith = totalPriceCart + taxPrice + shippingPrice;
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItem,
    totalPriceWithout: totalPriceCart,
    totalPriceWith,
    ...req.body,
  });
  if (order) {
    const bulkopt = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkopt, {});
    await Cart.findByIdAndDelete(cartId);
  }
  res.status(200).json({ data: order });
});

// @desc get specific order
// @route GET api/v1/order/orderId
// access Private / user
const populateOpt = {
  path: "user",
  select: "name image profileImage",
};
exports.getSpecificOrder = factory.getOne(Order, populateOpt);

// @desc get all orders
// @route GET api/v1/order/
// access Private / user || admin
exports.filterObj = (req, res, next) => {
  let filtering = { user: req.user._id };
  if (req.user.role == "user") req.filterObj = filtering;
  next();
};
exports.getAllOrders = factory.getAll(Order);

// @desc update pay state to paid
// @route PATCH api/v1/order/orderId/pay
// access Private / admin

exports.updatePay = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(
      new ApiError(`order with this id : ${orderId} not exists`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const data = await order.save();
  res.status(200).json({ data });
});
// @desc update delever state to delevered
// @route PATCH api/v1/order/orderId/delever
// access Private / admin

exports.updateDelever = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(
      new ApiError(`order with this id : ${orderId} not exists`, 404)
    );
  }
  order.isDelevered = true;
  order.deleveredAt = Date.now();
  const data = await order.save();
  res.status(200).json({ data });
});

// @desc get all price from cart and create session for stripe payment
// @route PATCH api/v1/order/checkout-session/:cartId
// access Private / user

exports.checkout = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new ApiError(`cart with this id ${cartId} not exists`, 400));
  }
  const allPrice = cart.isAppliedCoupon
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const finalPrice = allPrice + taxPrice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.user.name,
        amount: finalPrice,
        quantity: 1,
        currency: "egp",
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ msg: "status", session });
});
