import mongoose from 'mongoose';
import Category from '../../models/category.model.js';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { AppError } from '../../utils/appError.js';

export const createCategory = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    parentCategory,
    metaTitle,
    metaDescription,
    keywords,
    featured,
    sortOrder,
  } = req.body;

  if (!name?.trim()) {
    return next(new AppError('Category name is required', 400));
  }

  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    return next(new AppError('Category already exists', 400));
  }

  const newCategory = await Category.create({
    name: name.trim(),
    description: description?.trim() || '',
    parentCategory: parentCategory || null,
    metaTitle: metaTitle?.trim() || '',
    metaDescription: metaDescription?.trim() || '',
    keywords: keywords || [],
    featured: Boolean(featured),
    sortOrder: sortOrder || 0,
  });

  // ✅ Add to parent's subCategories (if applicable)
  if (parentCategory) {
    await Category.findByIdAndUpdate(parentCategory, {
      $addToSet: { subCategories: newCategory._id },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: newCategory,
  });
});

export const getAllCategoriesForSeller = asyncHandler(async (req, res) => {
  const categories = await Category.find({parentCategory : null})
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

export const getCategoriesByParentId = asyncHandler(async (req, res, next) => {
  const { id: parentCategory } = req.params;

  if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
    return next(new AppError('Invalid category parent ID', 400));
  }

  const categories = await Category.find({ parentCategory })
    .select('name slug description parentId image metaTitle metaDescription') // Select SEO-friendly fields
    .sort({ name: 1 });

  if (!categories.length) {
    return next(new AppError('No categories found for this parent ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Categories fetched successfully',
    count: categories.length,
    categories,
    meta: {
      title: `Categories under ${parentCategory}`,
      description: `Explore subcategories related to ${parentCategory} — find the best options easily.`,
    },
  });
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid category ID', 400));
  }

  const category = await Category.findById(id)
    .populate('parentCategory', 'name slug')
    .populate('subCategories', 'name slug status')
    .lean();

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid category ID', 400));
  }

  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    return next(new AppError('Category not found', 404));
  }

  // ✅ Prevent setting itself as parent
  if (updates.parentCategory && updates.parentCategory === id) {
    return next(new AppError('A category cannot be its own parent', 400));
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('parentCategory', 'name slug')
    .populate('subCategories', 'name slug status');

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid category ID', 400));
  }

  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // ✅ Remove reference from parent (if any)
  if (category.parentCategory) {
    await Category.findByIdAndUpdate(category.parentCategory, {
      $pull: { subCategories: category._id },
    });
  }

  // ✅ Detach subcategories (optional: set parentCategory to null)
  await Category.updateMany(
    { parentCategory: category._id },
    { $set: { parentCategory: null } }
  );

  await Category.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});