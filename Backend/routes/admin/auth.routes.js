import express from "express";
import { body, validationResult } from "express-validator";
import {
  createAdmin,
  loginAdmin,
  getAdmin,
  logoutAdmin,
  updateAdmin,
  updateAdminPassword,
} from "../../controllers/index.js";
import {protect} from "../../middlewares/authHandler.js";

const router = express.Router();

router.post(
  "/create",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must be numeric"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }
    await createAdmin(req, res, next);
  }
);

router.post(
  "/login",
  [
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must be numeric"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }
    await loginAdmin(req, res, next);
  }
);

router.get("/me", protect, getAdmin);

router.post("/logout", protect, logoutAdmin);

router.put("/update-details", protect, updateAdmin);

router.put("/change-password", protect, updateAdminPassword);

export default router;
