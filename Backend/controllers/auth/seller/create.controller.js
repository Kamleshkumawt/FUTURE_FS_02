import sellerModel from "../../../models/seller.model.js";
import { asyncHandler } from "../../../middlewares/errorHandler.js";
import { AppError } from "../../../utils/appError.js";

export const createSeller = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    throw new AppError("All fields are required", 400, "VALIDATION_ERROR");
  }

  const existingSeller = await sellerModel.findOne({ phoneNumber });
  if (existingSeller) {
    throw new AppError("You are already registered as a seller", 400, "DUPLICATE_SELLER");
  }

  const hashedPassword = await sellerModel.hashPassword(password);
  if (!hashedPassword) {
    throw new AppError("Error hashing password", 500, "HASH_ERROR");
  }

  const seller = await sellerModel.create({
    phoneNumber,
    password: hashedPassword,
  });

  if (!seller) {
    throw new AppError("Failed to create seller", 500, "CREATE_ERROR");
  }

  const token = seller.generateJWT();
  if (!token) {
    throw new AppError("Error generating authentication token", 500, "TOKEN_ERROR");
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 50 * 24 * 60 * 60 * 1000, // 50 days
  });


  return res.status(201).json({
    success: true,
    message: "Seller created successfully",
    seller: {
      _id: seller._id,
      phoneNumber: seller.phoneNumber,
    },
    token,
  });
});


export const sellerLoginController = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    throw new AppError("All fields are required", 400, "VALIDATION_ERROR");
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    throw new AppError("Please provide a valid 10-digit phone number", 400, "INVALID_PHONE");
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400, "INVALID_PASSWORD_LENGTH");
  }

  const seller = await sellerModel.findOne({ phoneNumber }).select("+password");
  if (!seller) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  if (seller.isDisabled) {
    throw new AppError(
      "Your account has been disabled. Please contact support.",
      403,
      "ACCOUNT_DISABLED"
    );
  }

  const isMatch = await seller.isValidPassword(password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  seller.lastActive = Date.now();
  await seller.save({ validateBeforeSave: false });

  const token = seller.generateJWT();
  if (!token) {
    throw new AppError("Error generating authentication token", 500, "TOKEN_ERROR");
  }

  seller.password = undefined;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 50 * 24 * 60 * 60 * 1000, // 50 days
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    seller: {
      _id: seller._id,
      phoneNumber: seller.phoneNumber,
      lastActive: seller.lastActive,
    },
    token,
  });
});

export const logoutSellerController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new AppError("Unauthorized access", 401, "UNAUTHORIZED"));

  const seller = await sellerModel.findOne({ _id: userId });
  if (!seller) return next(new AppError("Seller not found", 404, "SELLER_NOT_FOUND"));

  seller.lastActive = Date.now();
  await seller.save();

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

