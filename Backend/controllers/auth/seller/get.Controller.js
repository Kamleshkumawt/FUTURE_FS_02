import sellerModel from "../../../models/seller.model.js";
import { asyncHandler } from "../../../middlewares/errorHandler.js";
import { AppError } from "../../../utils/appError.js";
import uploadOnCloudinary from "../../../config/cloudinary.js";

export const getSellerProfileController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("Unauthorized access — no user found in request", 401, "UNAUTHORIZED"));
  }

  const seller = await sellerModel
    .findOne({ _id: userId })
    .select("-__v");

  if (!seller) {
    return next(new AppError("Seller profile not found", 404, "SELLER_NOT_FOUND"));
  }

  // console.log('seller',seller);

  const responseData = {
    id: seller._id,
    fullName: seller.fullName,
    shopName: seller.storeName,
    storeImage: seller.storeImage?.url,
    createdAt: seller.createdAt,
    updatedAt: seller.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "Seller profile fetched successfully",
    data: responseData,
  });
});

export const sellerPassController = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id;

  if (!userId) return next(new AppError("Unauthorized access", 401, "UNAUTHORIZED"));
  if (!oldPassword || !newPassword) {
    return next(new AppError("Both old and new passwords are required", 400, "VALIDATION_ERROR"));
  }

  const seller = await sellerModel.findOne({ _id: userId }).select("+password");
  if (!seller) return next(new AppError("Seller not found", 404, "SELLER_NOT_FOUND"));

  const isMatch = await seller.isValidPassword(oldPassword);
  if (!isMatch) return next(new AppError("Old password is incorrect", 400, "INVALID_OLD_PASSWORD"));

  // seller.password = await seller.hashPassword(newPassword);
  seller.password = newPassword;
  await seller.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const updateSellerController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError("Unauthorized access", 401, "UNAUTHORIZED"));

  const {
    storeName,
    storeDescription,
    storeAddress,
    gstNumber,
    bankDetails,
    policies,
    fullName,
  } = req.body;

// console.log('req.body before parsing policies', req.body);

// Safely parse policies if it's a string
let parsedPolicies = policies;
if (typeof policies === 'string') {
  try {
    parsedPolicies = JSON.parse(policies); // Single parse
  } catch (err) {
    return next(new AppError("Invalid policies format", 400, "INVALID_POLICIES"));
  }
}

  if (
    !storeName &&
    !storeDescription &&
    !storeAddress &&
    !gstNumber &&
    !bankDetails &&
    !policies &&
    !req.file &&
    !fullName
  ) {
    return next(new AppError("At least one field is required to update", 400, "VALIDATION_ERROR"));
  }

  let storeImage = null;

  // console.log("req.file", req.file);

  if (req.file?.path) {
    const result = await uploadOnCloudinary(req.file.path);
    // console.log("result", result);
    if (!result?.secure_url) {
      return next(new AppError("Failed to upload store image", 400, "IMAGE_UPLOAD_FAILED"));
    }
    storeImage = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  const updatedFields = {
    ...(storeName && { storeName }),
    ...(storeDescription && { storeDescription }),
    ...(storeAddress && { storeAddress }),
    ...(gstNumber && { gstNumber }),
    ...(bankDetails && { bankDetails }),
    ...(policies && { parsedPolicies }),
    ...(fullName && { fullName }),
    ...(storeImage && { storeImage }),
  };

  const seller = await sellerModel.findOneAndUpdate(
    { _id: userId },
    { $set: updatedFields },
    { new: true, runValidators: true }
  );

  if (!seller) return next(new AppError("Seller not found", 404, "SELLER_NOT_FOUND"));

  res.status(200).json({
    success: true,
    message: "Seller profile updated successfully",
    data: seller,
  });
});