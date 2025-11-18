import uploadOnCloudinary from "../../../config/cloudinary.js";
import { asyncHandler } from "../../../middlewares/errorHandler.js";
import adminModel from "../../../models/admin.model.js";
import { AppError} from "../../../utils/appError.js";

export const getAdmin = asyncHandler(async (req, res, next) => {
  const adminId = req.user?._id;
  if (!adminId) return next(new AppError("Unauthorized access", 401, "UNAUTHORIZED"));

  const admin = await adminModel.findById(adminId);
  if (!admin) return next(new AppError("Admin not found", 404, "NOT_FOUND"));

  const responseData = {
    id: admin._id,
    fullName: admin.username,
    profilePicture: admin.profilePicture?.url,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully",
    data: responseData,
  });
});

export const updateAdmin = asyncHandler(async (req, res, next) => {
  const adminId = req.user?._id;
  if (!adminId) return next(new AppError("Unauthorized access", 401));

  const admin = await adminModel.findById(adminId);
  if (!admin) return next(new AppError("Admin not found", 404));

  if (req.body.username?.trim()) admin.username = req.body.username.trim();
  if (req.file?.path) {
    try {
      const result = await uploadOnCloudinary(req.file.path);
      if (!result.success) {
        return next(new AppError("Failed to upload profile image", 400));
      }

      admin.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        uploadedAt: new Date(),
      };
    } catch (err) {
      return next(new AppError("Error uploading profile image", 500));
    }
  }

  await admin.save();

  const adminData = admin.toObject();
  delete adminData.password;

  const responseData = {
    id: admin._id,
    fullName: admin.username,
    profilePicture: admin.profilePicture?.url,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: responseData,
  });
});

export const updateAdminPassword = asyncHandler(async (req, res, next) => {
  const adminId = req.user?._id;
  if (!adminId) return next(new AppError("Unauthorized access", 401));

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new AppError("Both old and new passwords are required", 400));
  }

  const admin = await adminModel.findById(adminId).select("+password");
  if (!admin) return next(new AppError("Admin not found", 404));

  const isMatch = await admin.isValidPassword(oldPassword);
  if (!isMatch) return next(new AppError("Old password is incorrect", 400));

  admin.password = await adminModel.hashPassword(newPassword);
  await admin.save();

  const adminData = admin.toObject();
  delete adminData.password;

  res.status(200).json({
    success: true,
    message: "Admin password updated successfully", 
  });
});