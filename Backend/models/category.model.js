import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters long'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description can be up to 500 characters'],
    },

    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      default: null,
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],

    //
    // ⚙️ Additional Fields
    //
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ sortOrder: 1 });


categorySchema.virtual('fullPath').get(function () {
  return this.parentCategory
    ? `${this.parentCategory.name} > ${this.name}`
    : this.name;
});


const Category = model('category', categorySchema);

export default Category;
