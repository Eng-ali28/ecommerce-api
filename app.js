const path = require("path");
/* eslint-disable no-undef */
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
dotenv.config({
  path: "config.env",
});

const categoryRouter = require("./routes/categoryRouter");
const subCategoryRouter = require("./routes/subCategoryRouter");
const brandsRouter = require("./routes/brandRouter");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const loggeduserRouter = require("./routes/loggeduserRouter");
const connectToDatabase = require("./config/database");
const ApiError = require("./utils/ApiError");
const errorMiddleWare = require("./middleware/errorMiddleware");

// connect to database
connectToDatabase();
//express application
const app = express();
//middleware section
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());

//routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/loggeduser", loggeduserRouter);
app.all("*", (req, res, next) => {
  next(new ApiError(`this url not exists ${req.originalUrl}`, 404));
});

//Global error handling middleware
app.use(errorMiddleWare);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});
process.on("unhandledRejection", (err) => {
  console.log(`error is : ${err}`);
  server.close(() => process.exit(1));
});
