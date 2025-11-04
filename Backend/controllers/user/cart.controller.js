import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { asyncHandler } from '../../middleware/errorMiddleware.js';
import { AppError } from '../../utils/appError.js';

export const getCart = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId })
    .populate('items.productId', 'name price images')
    .lean();

  if (!cart) {
    return next(new AppError('Cart not found', 404, 'CART_NOT_FOUND'));
  }

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  res.status(200).json({
    success: true,
    data: { ...cart, totalItems },
  });
});

export const addItemToCart = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity = 1 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError('Invalid product ID', 400, 'INVALID_PRODUCT_ID'));
  }

  const product = await Product.findById(productId).select('stock price');
  if (!product) {
    return next(new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND'));
  }

  if (product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK'));
  }

  let cart = await Cart.findOne({ userId });

  // If user has no cart, create one
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
  }

  res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
});

export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError('Invalid product ID', 400, 'INVALID_PRODUCT_ID'));
  }

  if (quantity < 1) {
    return next(new AppError('Quantity must be at least 1', 400, 'INVALID_QUANTITY'));
  }

  const cart = await Cart.findOneAndUpdate(
    { userId, 'items.productId': productId },
    { $set: { 'items.$.quantity': quantity } },
    { new: true }
  ).populate('items.productId', 'name price');

  if (!cart) {
    return next(new AppError('Cart or product not found', 404, 'CART_NOT_FOUND'));
  }

  res.status(200).json({ success: true, data: cart });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const { userId, productId } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } },
    { new: true }
  );

  if (!cart) {
    return next(new AppError('Cart not found', 404, 'CART_NOT_FOUND'));
  }

  res.status(200).json({ success: true, message: 'Item removed', data: cart });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );

  if (!cart) {
    return next(new AppError('Cart not found', 404, 'CART_NOT_FOUND'));
  }

  res.status(200).json({ success: true, message: 'Cart cleared' });
});
