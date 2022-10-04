const ApiError = require("../utils/ApiError");

const errorMiddleWare = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name == "TokenExpiredError")
      err = new ApiError("Expired token, please login again.", 401);
    sendProd(err, res);
  }
};
const sendDev = (err, res) => {
  return res.status(err.statusCode).json({
    message: err.message,
    err,
    stack: err.stack,
  });
};
const sendProd = (err, res) => {
  return res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
  });
};
module.exports = errorMiddleWare;
