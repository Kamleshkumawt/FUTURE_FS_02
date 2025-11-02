import userModel from "../../models/user.model.js";
import { asyncHandler } from "../../middleware/errorMiddleware.js";
import { AppError } from "../../utils/appError.js";

export const getProfileController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized access.", 401, "AUTH_REQUIRED"));
  }

  const user = await userModel
    .findById(userId)
    .select("-password -__v -profile_picture.publicId");

  if (!user) {
    return next(new AppError("User profile not found.", 404, "USER_NOT_FOUND"));
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully.",
    user,
  });
});

export const updateProfileController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return next(new AppError("Unauthorized access.", 401, "AUTH_REQUIRED"));
  }

  const allowedFields = [
    "fullName",
    "email",
    "phone",
    "profile_picture",
  ];

  const updateData = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updateData[key] = req.body[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return next(new AppError("No valid fields provided for update.", 400, "NO_UPDATE_FIELDS"));
  }

  if (updateData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateData.email)) {
      return next(new AppError("Invalid email format.", 400, "INVALID_EMAIL"));
    }

    const existingEmail = await userModel.findOne({
      email: updateData.email,
      _id: { $ne: userId },
    });
    if (existingEmail) {
      return next(new AppError("Email already in use.", 400, "DUPLICATE_EMAIL"));
    }
  }

  if (updateData.phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(updateData.phone)) {
      return next(new AppError("Invalid phone number format.", 400, "INVALID_PHONE"));
    }

    const existingPhone = await userModel.findOne({
      phone: updateData.phone,
      _id: { $ne: userId },
    });
    if (existingPhone) {
      return next(new AppError("Phone number already in use.", 400, "DUPLICATE_PHONE"));
    }
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .select("-password -__v");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
});
