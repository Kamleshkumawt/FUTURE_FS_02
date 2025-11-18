// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import User from "../models/user.model.js";
import Seller from "../models/seller.model.js";
import Admin from "../models/admin.model.js";

export const protect = async (req, res, next) => {
  try {

    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);
    if (!token) {
      return next(new AppError("Unauthorized access. Token missing.", 401, "AUTH_NO_TOKEN"));
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log('decoded',decoded);

    if (!decoded || !decoded._id) {
      return next(new AppError("Invalid or expired token.", 401, "AUTH_INVALID_TOKEN"));
    }

    let user;

switch (decoded.role) {
  case 'user':
    user = await User.findById(decoded._id).select("_id email role isDisabled");
    break;
  case 'seller':
    user = await Seller.findById(decoded._id).select("_id email role isDisabled");
    break;
  case 'admin':
    user = await Admin.findById(decoded._id).select("_id email role isDisabled");
    break;
  default:
    return next(new AppError("Invalid role in token.", 401, "AUTH_INVALID_ROLE"));
}

    if (!user) {
      return next(new AppError("User not found.", 404, "USER_NOT_FOUND"));
    }

    if (user.isDisabled) {
      return next(new AppError("Your account has been disabled. Contact support.", 403, "USER_DISABLED"));
    }


    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Session expired. Please log in again.", 401, "TOKEN_EXPIRED"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid authentication token.", 401, "TOKEN_INVALID"));
    }

    next(new AppError("Internal authentication error.", 500, "AUTH_SERVER_ERROR"));
  }
};
