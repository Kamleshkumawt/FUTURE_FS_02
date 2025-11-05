import mongoose from 'mongoose';
import uploadOnCloudinary from '../../config/cloudinary.js';
import Review from '../../models/review.model.js';
import Product from '../../models/product.model.js';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { AppError } from '../../utils/appError.js';

export const createReview = asyncHandler(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError('Invalid product ID', 400, 'INVALID_PRODUCT_ID'));
  }

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400, 'INVALID_RATING'));
  }

  if (!comment || comment.trim().length < 5) {
    return next(new AppError('Comment must be at least 5 characters', 400, 'INVALID_COMMENT'));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND'));
  }

  const existingReview = await Review.findOne({ userId, productId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this product', 400, 'DUPLICATE_REVIEW'));
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    console.log(`📸 Uploading ${req.files.length} images to Cloudinary...`);

    const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path));
    const cloudinaryResults = await Promise.allSettled(uploadPromises);

    images = cloudinaryResults
      .filter((result) => result.status === 'fulfilled' && result.value?.secure_url)
      .map(({ value }) => ({
        url: value.secure_url,
        publicId: value.public_id,
        width: value.width,
        height: value.height,
        format: value.format,
        bytes: value.bytes,
      }));

    if (images.length === 0) {
      return next(new AppError('Image upload failed', 500, 'UPLOAD_FAILED'));
    }
  }

  const newReview = await Review.create({ userId, productId, rating, images, comment });

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: newReview,
  });
});

export const getReviewsByProductId = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError('Invalid product ID', 400, 'INVALID_PRODUCT_ID'));
  }

  const reviews = await Review.find({ productId })
    .populate('userId', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: 'Reviews fetched successfully',
    count: reviews.length,
    data: reviews,
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid review ID', 400, 'INVALID_REVIEW_ID'));
  }

  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError('Review not found', 404, 'REVIEW_NOT_FOUND'));
  }


  if (review.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review', 403, 'FORBIDDEN'));
  }

  await Review.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
