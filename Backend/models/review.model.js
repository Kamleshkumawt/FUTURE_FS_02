import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: String,
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length <= 5;
        },
        message: 'You can upload a maximum of 5 images per review',
      },
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [5, 'Comment must be at least 5 characters long'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false, // Removes __v
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });


reviewSchema.statics.calcAverageRatings = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Product = (await import('./product.model.js')).default;

    if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: result[0].avgRating.toFixed(1),
        numOfReviews: result[0].numOfReviews,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        numOfReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error updating product rating:', err);
  }
};


reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.productId);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.productId);
});

const Review = model('review', reviewSchema);

export default Review;
