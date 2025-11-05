import { asyncHandler } from "../../../middlewares/errorHandler.js";
import { AppError } from "../../../utils/appError.js";
import userModel from "../../../models/user.model.js";

export const loginController = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;

  if (!password || (!email && !phone)) {
    return next(new AppError("Email or phone and password are required.", 400, "LOGIN_VALIDATION_ERROR"));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters long.", 400, "WEAK_PASSWORD"));
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return next(new AppError("Please provide a valid 10-digit phone number.", 400, "INVALID_PHONE"));
    }
  }


  const user = await userModel.findOne({ $or: [{ email }, { phone }] }).select("+password");

  if (!user) {
    return next(new AppError("Invalid credentials. User not found.", 401, "INVALID_CREDENTIALS"));
  }


  if (user.isDisabled) {
    return next(new AppError("Your account has been disabled. Please contact support.", 403, "USER_DISABLED"));
  }


  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials. Password does not match.", 401, "INVALID_PASSWORD"));
  }

  const token = user.generateJWT();
  if (!token) {
    return next(new AppError("Error generating authentication token.", 500, "TOKEN_GENERATION_FAILED"));
  }


  userModel.findByIdAndUpdate(user._id, { lastActive: Date.now() }).catch(err => {
    console.error("Failed to update lastActive:", err.message);
  });


  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });


  const safeUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  res.status(200).json({
    success: true,
    message: "Login successful.",
    user: safeUser,
    token,
  });
});
