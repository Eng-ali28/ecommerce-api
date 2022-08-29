// @desc            this class for handling error and get the best result
// @requirments     pass message and status code ==> new ApiError(message, statusCode)

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message); // for handling message like Error class
    this.statusCode = statusCode; //add statusCode property for any opject error
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error"; // status = fail if statusCode start with 4 and status = error if statusCode start with 5
    this.operational = true;
  }
}

module.exports = ApiError;
