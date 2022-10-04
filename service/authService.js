const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
// @desc signup
// @route POST /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const newUser = await User.create({
    name,
    slug: slugify(name),
    email,
    phone,
    password,
  });
  const token = jwt.sign(
    { name, email, phone, userId: newUser._id },
    process.env.SECRET,
    {
      expiresIn: process.env.jwt_expire,
    }
  );
  res.cookie("token", `bearer ${token}`, {
    httpOnly: true,
  });
  res.status(201).json({ result: newUser });
});
// @desc login
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new ApiError("email or password in correct", 401));
  }
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        next(new ApiError("email or password incorrect", 401));
      } else {
        const token = jwt.sign(
          { userId: user._id, name: user.name },
          process.env.SECRET,
          {
            expiresIn: process.env.jwt_expire,
          }
        );
        res.cookie("token", `bearer ${token}`, {
          httpOnly: true,
        });
        res.status(200).json({ result: user });
      }
    });
  }
});
// @desc logout
// @route POST api/v1/auth/logout
// @access Public
exports.logout = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    res.clearCookie("token");
    res.status(200).json({ msg: "success logout" });
  } else {
    next(new ApiError("you must be to login or signup", 401));
  }
});
// @desc protect route by 4 steps
// @type middleware
exports.protect = asyncHandler(async (req, res, next) => {
  // step 1: check if token exists and get it if exists.
  let token;
  if (req.cookies.token) token = req.cookies.token.split(" ")[1];
  else return next(new ApiError("please login or signup", 401));
  // step 2: verfiy token(no change happens , expired token)
  const decode = jwt.verify(token, process.env.SECRET);
  // step 3: check if user exists
  const user = await User.findById(decode.userId);
  if (!user) {
    return next(
      new ApiError("user with this id not exists, please signup", 401)
    );
  }
  // step 4: check if user active if not active redirect to activate route
  if (!user.active) {
    return next(new ApiError("your account is not active .", 400));
  }
  // step 5: check if user change his password after token create , if change it redirect to sign in
  const passwordChangeTime = parseInt(user.passwordChangeTime.getTime() / 1000); //here we convert Date time to timestamp for compare
  console.log(passwordChangeTime, decode.iat);
  if (passwordChangeTime >= decode.iat) {
    res.clearCookie("token");
    return next(new ApiError("password has changed, please login", 401));
  }

  req.user = user;
  next();
});
// @desc [admin , manager]
exports.getRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("sorry, you can't access this route.", 403));
    }
    next();
  });
};

// forget password by 3 routes
// 1- forgot password

// @desc generate resetcode and send via email
// @route POST api/v1/auth/forgotpassword
// @access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is not user with this email:${req.body.email}`, 404)
    );
  }
  // generate reset code about 6-digits
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerfiy = false;
  await user.save();

  //send reset password code
  const message = `Hi ${user.name} 
  \n We received a request to reset the password on your ALI HAMOUD APP Account. 
  \n reset code is ${resetCode} \n Enter this code to complete the reset. 
  \n ALI HAMOUD team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password code",
      message,
    });
  } catch (error) {
    next(new ApiError("error in send email", 500));
  }
  res.status(200).json({ status: "Success", result: "send email Done" });
});
// step 2) verify reset code
// @desc get verified about the reset code
// @route POST api/v1/auth/verifycode
// @access Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  //1- get reset code from body and hash by crypto
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  //2- get user by hashResetCode and expireDate greater than Date.now() for sure about valid code
  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpire: { $gt: Date.now() },
  });
  //3- handle error and update verifyResetCode to true and send response
  if (!user) {
    return next(
      new ApiError(
        "Invalid reset code or expired, try to resend it please.",
        404
      )
    );
  }
  user.passwordResetVerfiy = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

// step 3) reset new password

// @desc reset new password
// @route PUT api/v1/auth/resetpassword
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1- get user by email from body
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("there is not user with this email", 404));
  }
  //2- show if verify value is true and reset new password or return error
  if (!user.passwordResetVerfiy) {
    return next(new ApiError("please try again you are not verified", 401));
  }
  user.password = req.body.newPassword;
  //3- put undefind value for expire , reset and verfiy reset code
  user.passwordChangeTime = Date.now();
  user.passwordResetCode = undefined;
  user.passwordResetExpire = undefined;
  user.passwordResetVerfiy = undefined;
  await user.save();
  //4- generate new token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.SECRET
  );
  res.cookie("token", `bearer ${token}`, { httpOnly: true });
  res.status(200).json({ msg: "Success update new password" });
});
