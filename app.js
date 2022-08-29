const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

dotenv.config({
  path: "config.env",
});

const categoryRouter = require("./routes/categoryRouter");
const connectToDatabase = require("./config/database");
const ApiError = require("./utils/ApiError");
const errorMiddleWare = require("./middleware/errorMiddleware");
// connect to database

connectToDatabase();
const app = express();
//middleware section
app.use(express.json());
if (process.eventNames.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//routes
app.use("/api/v1/categories", categoryRouter);
app.all("*", (req, res, next) => {
  //const error = new Error(`this route ${req.originalUrl} not exists`);
  //error.statusCode = 404;
  next(new ApiError(`this url not exists ${req.originalUrl}`, 404));
});

//Global error handling middleware
app.use(errorMiddleWare);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});
