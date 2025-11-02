import userModel from "../../models/user.model.js";
import { asyncHandler } from "../../middleware/errorMiddleware.js";
import { AppError } from "../../utils/appError.js";

export const registerController = asyncHandler(async (req, res, next) => {
  const { email, phone, password, name } = req.body;

  if (!name || !password) {
    return next(new AppError("All fields are required.", 400, "VALIDATION_ERROR"));
  }

  if (!email && !phone) {
    return next(new AppError("Either email or phone is required.", 400, "MISSING_CONTACT"));
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format.", 400, "INVALID_EMAIL"));
    }
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return next(new AppError("Phone number must be a valid 10-digit number.", 400, "INVALID_PHONE"));
    }
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters long.", 400, "WEAK_PASSWORD"));
  }


  const existingUser = await userModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    if (existingUser.email === email && existingUser.phone === phone) {
      return next(new AppError("User with this email and phone already exists.", 400, "DUPLICATE_USER"));
    } else if (existingUser.email === email) {
      return next(new AppError("Email already in use.", 400, "DUPLICATE_EMAIL"));
    } else if (existingUser.phone === phone) {
      return next(new AppError("Phone number already in use.", 400, "DUPLICATE_PHONE"));
    }
  }

  const hashedPassword = await userModel.hashPassword(password);
  if (!hashedPassword) {
    return next(new AppError("Error hashing password.", 500, "HASHING_ERROR"));
  }


  const baseUsername = name.trim().toLowerCase().replace(/\s+/g, "_");
  const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

  const user = await userModel.create({
    username,
    email,
    phone,
    password: hashedPassword,
    fullName: name,
  });


  const token = user.generateJWT();
  if (!token) {
    return next(new AppError("Error generating token.", 500, "TOKEN_ERROR"));
  }

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

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    user: safeUser,
    token,
  });
});
