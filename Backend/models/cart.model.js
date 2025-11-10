import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User ID is required'],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Cart must have at least one item.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false, // disables __v field for cleaner documents
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

cartSchema.pre('save', function (next) {
  const productIds = this.items.map(item => item.productId.toString());
  const hasDuplicates = new Set(productIds).size !== productIds.length;

  if (hasDuplicates) {
    return next(new Error('Duplicate products are not allowed in the cart.'));
  }
  next();
});

cartSchema.statics.addItem = async function (userId, productId, quantity = 1) {
  return this.findOneAndUpdate(
    { userId, 'items.productId': { $ne: productId } },
    { $push: { items: { productId, quantity } } },
    { upsert: true, new: true }
  );
};

cartSchema.statics.updateQuantity = async function (userId, productId, quantity) {
  return this.findOneAndUpdate(
    { userId, 'items.productId': productId },
    { $set: { 'items.$.quantity': quantity } },
    { new: true }
  );
};

cartSchema.index({ 'items.productId': 1 });

const Cart = model('cart', cartSchema);

export default Cart;
