import userModel from "../../models/user.model.js";
import { asyncHandler } from "../../middleware/errorMiddleware.js";
import { AppError } from "../../utils/appError.js";
import { uploadOnCloudinary } from "../../../config/cloudinary.js";

export const getProfileController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError("Unauthorized access", 401));

  const user = await userModel
    .findById(userId)
    .select("-password -__v");

  if (!user) return next(new AppError("User profile not found", 404));

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profile_picture?.url || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const updateProfileController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError("Unauthorized access", 401));

  const user = await userModel.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path);
    if (!result.success) {
      return next(new AppError("Failed to upload profile image", 500));
    }

    user.profile_picture = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  const allowedFields = ["username", "email", "phone"];
  allowedFields.forEach((field) => {
    if (req.body[field]) user[field] = req.body[field];
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profile_picture?.url || null,
      updatedAt: user.updatedAt,
    },
  });
});

export const updateProfilePasswordController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { oldPassword, newPassword } = req.body;

  if (!userId) return next(new AppError("Unauthorized access", 401));
  if (!oldPassword || !newPassword)
    return next(new AppError("Both old and new passwords are required", 400));
  if (newPassword.length < 6)
    return next(new AppError("New password must be at least 6 characters long", 400));

  const user = await userModel.findById(userId).select("+password");
  if (!user) return next(new AppError("User not found", 404));

  const isMatch = await user.isValidPassword(oldPassword);
  if (!isMatch) return next(new AppError("Old password is incorrect", 400));

  user.password = await userModel.hashPassword(newPassword);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});