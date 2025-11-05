import { asyncHandler } from "../../../middlewares/errorHandler.js";
import Admin from "../../../models/admin.model.js";
import { AppError} from "../../../utils/appError.js";

export const createAdmin = asyncHandler(async (req, res, next) => {
  const { phone, password, username } = req.body;

  if (!phone || !password || !username) {
    return next(
      new AppError("Phone, username, and password are required", 400, "VALIDATION_ERROR")
    );
  }

  const existingAdmin = await Admin.findOne();
  if (existingAdmin) {
    return next(new AppError("Admin already exists", 400, "ADMIN_EXISTS"));
  }

  const hashedPassword = await Admin.hashPassword(password);

  const admin = await Admin.create({ phone, username, password: hashedPassword });

  const token = admin.generateJWT();

  const adminData = admin.toObject();
  delete adminData.password;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: adminData,
    token,
  });
});

export const loginAdmin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new AppError("Phone and password are required", 400, "VALIDATION_ERROR"));
  }

  const admin = await Admin.findOne({ phone }).select("+password");
  if (!admin) return next(new AppError("Invalid credentials", 401, "UNAUTHORIZED"));

  const isMatch = await admin.isValidPassword(password);
  if (!isMatch) return next(new AppError("Invalid credentials", 401, "UNAUTHORIZED"));

  const token = admin.generateJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: admin.toJSON(),
    token,
  });
});

export const logoutAdmin = asyncHandler(async (req, res, next) => {
  const adminId = req.user?._id;
  if (!adminId) return next(new AppError("Unauthorized access", 401, "UNAUTHORIZED"));

  const admin = await Admin.findById(adminId);
  if (!admin) return next(new AppError("Admin not found", 404, "NOT_FOUND"));

  admin.lastActive = new Date();
  await admin.save();

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

