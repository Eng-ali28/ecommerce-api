const errorMiddleWare = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
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
