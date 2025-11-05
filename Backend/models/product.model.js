import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model } = mongoose;


const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);


const addressSchema = new Schema(
  {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  { _id: false }
);


const productSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'seller',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description should be at least 10 characters'],
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'SKU (Stock Keeping Unit) is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'subCategory',
    },
    tags: [{ type: String, trim: true }],

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      percentage: { type: Number, default: 0, min: 0, max: 100 },
      validUntil: { type: Date },
    },
    finalPrice: { type: Number, default: 0 },

    
    color: { type: String, required: [true, 'Color is required'] },
    size: [{ type: String, required: true }],
    material: { type: String, required: [true, 'Material is required'] },
    weight: { type: Number, required: true },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    battery: { type: String },
    ageGroup: { type: String }, // e.g. "3-5 years", "18+"
    gender: { type: String, enum: ['Male', 'Female', 'Unisex'] },

    
    quantity: { type: Number, required: true, default: 0 },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Low Stock', 'Inactive'],
      default: 'In Stock',
    },
    skuVariants: [
      {
        color: String,
        size: String,
        sku: String,
        quantity: Number,
      },
    ],

    
    manufacturerAddr: addressSchema,
    packerAddr: addressSchema,
    hsnCode: { type: String, required: [true, 'HSN Code is required'] },
    styleCode: { type: String },

    
    returnPolicyDays: { type: Number, default: 7 },
    shippingTimeDays: { type: Number, default: 4 },
    warrantyPeriod: { type: String }, // e.g. "6 months", "1 year"

    
    frontImage: { type: imageSchema, required: true },
    images: { type: [imageSchema], validate: [arrayLimit, '{PATH} exceeds image limit of 10'] },

    
    numOfReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String },

    
    comboType: { type: String, enum: ['single', 'combo'], default: 'single' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ categoryId: 1, price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ slug: 1 });


function arrayLimit(val) {
  return val.length <= 10;
}

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.discount?.percentage > 0) {
    const discountAmount = (this.price * this.discount.percentage) / 100;
    this.finalPrice = this.price - discountAmount;
  } else {
    this.finalPrice = this.price;
  }

  if (this.quantity <= 0) this.stockStatus = 'Out of Stock';
  else if (this.quantity < 5) this.stockStatus = 'Low Stock';
  else this.stockStatus = 'In Stock';

  next();
});


productSchema.virtual('isDiscountActive').get(function () {
  return (
    this.discount &&
    this.discount.percentage > 0 &&
    (!this.discount.validUntil || this.discount.validUntil > new Date())
  );
});


const Product = model('product', productSchema);

export default Product;
