const categoryRouter = require("./categoryRouter");
const subCategoryRouter = require("./subCategoryRouter");
const brandsRouter = require("./brandRouter");
const productRouter = require("./productRoute");
const userRouter = require("./userRouter");
const authRouter = require("./authRouter");
const loggeduserRouter = require("./loggeduserRouter");
const reviewRouter = require("./reviewRoute");
const wishlistRouter = require("./wishlistRouter");
const addressRouter = require("./addressRouter");
const couponRouter = require("./couponRouter");
const cartRouter = require("./cartRoute");
const mountRoute = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandsRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/loggeduser", loggeduserRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/cart", cartRouter);
};

module.exports = mountRoute;
