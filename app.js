const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
dotenv.config({
  path: "config.env",
});
const cors = require("cors");
const compression = require("compression");
const connectToDatabase = require("./config/database");
const ApiError = require("./utils/ApiError");
const errorMiddleWare = require("./middleware/errorMiddleware");

// connect to database
connectToDatabase();
//express application
const app = express();
//middleware section
app.use(express.json());
//enable cors
app.use(cors());
//compress all response
app.use(compression());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());

//routes
const mountRoute = require("./routes");
mountRoute(app);
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
