import express from "express";
import {
  createOrder,
  getOrdersByUserId,
  getOrdersBySellerId,
  updateOrderStatus,
  getSellerOrderStats,
  getIncomeBySellerId,
  getOrdersByStatusForSeller,
  handlePaymentSuccess
} from "../../controllers/index.js";

import { protect } from "../../middlewares/authHandler.js";

const router = express.Router();

// Create a new order (User)
router.post("/create", protect, createOrder);

// Get all orders of logged-in user
router.get("/my-orders", protect, getOrdersByUserId);

// Get all orders that contain seller's products
router.get("/seller/orders", protect, getOrdersBySellerId);

// Update order status (Seller)
router.put("/seller/update-status/:id", protect, updateOrderStatus);

router.get("/seller/all/stats", protect, getOrdersByStatusForSeller);

// Seller stats
router.get("/seller/stats", protect, getSellerOrderStats);


// Seller income report
router.get("/seller/income", protect, getIncomeBySellerId);

router.post("/success/stripe", handlePaymentSuccess);

export default router;
