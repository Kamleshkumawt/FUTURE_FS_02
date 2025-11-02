import userModel from "../../models/user.model.js";
import { asyncHandler } from "../../middleware/errorMiddleware.js";
import { AppError } from "../../utils/appError.js";

export const logoutController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized access.", 401, "AUTH_REQUIRED"));
  }

  const user = await userModel.findByIdAndUpdate(
    userId,
    { lastActive: Date.now() },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found.", 404, "USER_NOT_FOUND"));
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});
