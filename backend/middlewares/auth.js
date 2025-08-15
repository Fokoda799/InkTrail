import ErrorHandler from "../utils/errorHundler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  let { token } = req.cookies;

  // Check if token is present
  if (!token) {
    token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resources", 401)
      );
    }
  }

  // Verify the token
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  // Attach user information to the request object
  req.user = await User.findById(decodedData.id);
  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role  : ${req.user.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};

export { isAuthenticatedUser, authorizeRoles };