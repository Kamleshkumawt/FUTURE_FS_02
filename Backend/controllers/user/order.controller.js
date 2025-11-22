import orderModel from "../../models/order.model.js";
import cartModel from "../../models/cart.model.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import mongoose from "mongoose";
import Stripe from "stripe";

export const createOrder = asyncHandler(async (req, res) => {
  const { 
    shipping_address,
    payment_method,
    items,
    tax_amount = 0,
    shipping_fee = 0,
    paymentId
  } = req.body;

  const {origin} = req.headers;
  // console.log('req.body : ',req.body);
  const userId = req.user?._id;

  if (!items || items.length === 0) {
    throw new AppError("Order items cannot be empty", 400);
  }

  if (!shipping_address) {
    throw new AppError("Shipping address is required", 400);
  }

  if (!payment_method) {
    throw new AppError("Payment method is required", 400);
  }

  if (!userId) {
    throw new AppError("Unauthorized access", 401);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await orderModel.create({
    userId,
    items,
    subtotal,
    tax_amount,
    shipping_fee,
    shipping_address,
    payment_method,
    paymentId: paymentId || null,
    payment_status: payment_method === "cash_on_delivery" ? "Pending" : "Pending"
  });

  await cartModel.findOneAndDelete({ userId });


  //gateway integration
 if(payment_method === "online"){
   const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const line_items = [{
    price_data: {
      currency: "inr",
      product_data: {
        name: "Order Payment",
      },
      unit_amount: Math.round((subtotal + tax_amount + shipping_fee) * 100),
    },
    quantity: 1,
  }]

  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${origin}/user/orders`,
    cancel_url: `${origin}/cart`,
    metadata: { orderId: order._id.toString() },
    expire_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
  });

  order.paymentId = session.url;
  await order.save();

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    url: session.url,
  });
 }

 return res.status(201).json({
    success: true,
    message: "Order created successfully",
  });

});

export const getOrdersByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const orders = await orderModel.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    message: "User orders fetched successfully",
    orders,
    pagination: { page, limit }
  });
});

export const getOrdersBySellerId = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(req.user._id);

  const orders = await orderModel.aggregate([
    { $unwind: "$items" },

    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },

    { $match: { "product.sellerId": sellerId } },

    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        status: { $first: "$status" },
        total_amount: { $first: "$total_amount" },
        createdAt: { $first: "$createdAt" },
        shipping_address: { $first: "$shipping_address" },
        items: { $push: "$items" }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },

    { $unwind: "$user" }
  ]);

  res.status(200).json({
    success: true,
    message: "Seller orders fetched successfully",
    orders
  });
});

const VALID_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  if (!VALID_STATUSES.includes(status)) {
    throw new AppError("Invalid order status.", 400);
  }

  const order = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) throw new AppError("Order not found", 404);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order
  });
});

export const getSellerOrderStats = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(req.user._id);

  // console.log('sellerId : ',sellerId);

  const stats = await orderModel.aggregate([
    { $unwind: "$items" },

    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },

    { $match: { "product.sellerId": sellerId } },

    {
      $group: {
        _id: "$status",
        total: { $sum: 1 },
        monthly: {
          $push: {
            month: { $month: "$createdAt" },
            count: 1
          }
        }
      }
    }
  ]);

  // console.log('stats : ',stats);

  res.status(200).json({
    success: true,
    message: "Seller order statistics fetched successfully",
    stats
  });
});

export const getOrdersByStatusForSeller = asyncHandler(async (req, res) => {
  const sellerId = req.user?._id;

  const [pending, shipped, delivered, cancelled] = await Promise.all([
    orderModel.countDocuments({ status: "Pending", "items.sellerId": sellerId }),
    orderModel.countDocuments({ status: "Shipped", "items.sellerId": sellerId }),
    orderModel.countDocuments({ status: "Delivered", "items.sellerId": sellerId }),
    orderModel.countDocuments({ status: "Cancelled", "items.sellerId": sellerId }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Order status counts fetched successfully',
    orders: { pending, shipped, delivered, cancelled },
  });
});

export const getIncomeBySellerId = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(req.user._id);

  const stats = await orderModel.aggregate([
    { $unwind: "$items" },

    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },

    { $match: { "product.sellerId": sellerId } },

    {
      $group: {
        _id: "$status",
        totalIncome: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        totalSales: { $sum: "$items.quantity" },
        monthly: {
          $push: {
            month: { $month: "$createdAt" },
            income: { $multiply: ["$items.price", "$items.quantity"] },
            sales: "$items.quantity"
          }
        }
      }
    }
  ]);

  // console.log('stats : ',stats);

  res.status(200).json({
    success: true,
    message: "Seller income report generated successfully",
    stats
  });
});

export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json({ success: true, message: "All orders fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export const getOrdersById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await orderModel
      .findById(orderId);

    res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateOrderStatusByAdmin = async (req, res) => {
  try {

    console.log('status, orderId : ', req.body);
    const { status, orderId } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllDeliveredOrdersCount = async (req, res) => {
  try {
      const deliveredOrdersCount = await orderModel.countDocuments({ status: "Delivered" });
      res.status(200).json({ success: true, message: "Delivered orders count fetched successfully", count: deliveredOrdersCount });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

export const getAllCancelledOrdersCount = async (req, res) => {
  try {
      const CancelledOrdersCount = await orderModel.countDocuments({ status: "Cancelled" });
      res.status(200).json({ success: true, message: "Cancelled orders count fetched successfully", count: CancelledOrdersCount });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

export const getAllOrdersCount = asyncHandler(async (req, res) => {
  // const [pending, shipped, delivered, cancelled] = await Promise.all([
  //   orderModel.countDocuments({ status: "Pending"}),
  //   orderModel.countDocuments({ status: "Shipped"}),
  //   orderModel.countDocuments({ status: "Delivered"}),
  //   orderModel.countDocuments({ status: "Cancelled"}),
  // ]);

  const status = await orderModel.aggregate([
  {
    $group: {
      _id: {
        status: "$status",
        month: { $month: "$createdAt" }
      },
      count: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.status",
      monthly: {
        $push: {
          month: "$_id.month",
          count: "$count"
        }
      },
      total: { $sum: "$count" }
    }
  },
  {
    $project: {
      _id: 1,
      total: 1,
      monthly: 1
    }
  }
]);

  res.status(200).json({
    success: true,
    message: 'Order status counts fetched successfully',
    status,
  });
});