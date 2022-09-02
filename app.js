/* eslint-disable no-undef */
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({
  path: "config.env",
});

const categoryRouter = require("./routes/categoryRouter");
const subCategoryRouter = require("./routes/subCategoryRouter");
const connectToDatabase = require("./config/database");
const ApiError = require("./utils/ApiError");
const errorMiddleWare = require("./middleware/errorMiddleware");

// connect to database
connectToDatabase();
//express application
const app = express();
//middleware section
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
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
