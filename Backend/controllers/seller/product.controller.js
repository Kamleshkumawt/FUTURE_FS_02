import productModel from '../../models/product.model.js';
import categoryModel from '../../models/category.model.js';
import sellerModel from '../../models/seller.model.js';
import uploadOnCloudinary from '../../config/cloudinary.js';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { AppError } from '../../utils/appError.js';
import slugify from 'slugify';

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    quantity,
    color,
    brand,
    discount,
    tags,
    weight,
    dimensions,
    size,
    material,
    battery,
    age,
    hsnCode,
    styleCode,
    comboType,
    gstNumber,
    manufacturerAddr,
    packerAddr,
  } = req.body;

  const sellerId = req.user?._id;

  if (!name || !price || !description || !category || !quantity || !color || !brand ||
      !weight || !dimensions || !size || !material || !battery || !age ||
      !hsnCode || !comboType || !manufacturerAddr || !packerAddr) {
    throw new AppError('Please provide all required fields', 400);
  }

  if (description.length < 10 || description.length > 1000)
    throw new AppError('Description must be between 10 and 1000 characters', 400);

  if (price <= 0 || quantity <= 0)
    throw new AppError('Price and quantity must be positive numbers', 400);

  const store = await sellerModel.findById(sellerId);
  if (!store) throw new AppError('Seller not found', 404);

  if (store.store_name.trim() !== brand.trim())
    throw new AppError('Brand mismatch with seller store name', 400);

  if (store.gstNumber.trim() !== gstNumber.trim())
    throw new AppError('GST number mismatch with seller record', 400);

  const uploadImage = async (file) => {
    const result = await uploadOnCloudinary(file.path);
    if (!result?.success) throw new AppError('Image upload failed', 500);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  };

  if (!req.files?.frontImage?.[0])
    throw new AppError('Front image is required', 400);
  const frontImage = await uploadImage(req.files.frontImage[0]);

  if (!req.files?.images?.length)
    throw new AppError('Please upload at least one product image', 400);
  const images = await Promise.all(req.files.images.map(uploadImage));


  const existingProduct = await productModel.findOne({ name: name.trim(), sellerId });
  if (existingProduct) throw new AppError('Product with this name already exists', 400);

  const categoryDoc = await categoryModel.findOne({ name: category.trim() });
  if (!categoryDoc) throw new AppError('Category not found', 404);

  const cleanTags = Array.isArray(tags)
    ? tags.map(t => t.trim().toLowerCase()).filter(Boolean)
    : typeof tags === 'string'
    ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    : [];


  const slug = slugify(name, { lower: true, strict: true });


  const product = await productModel.create({
    sellerId,
    name: name.trim(),
    slug,
    description: description.trim(),
    price,
    color: color.trim(),
    brand: brand.trim(),
    categoryId: categoryDoc._id,
    discount: discount || { percentage: 0 },
    quantity,
    tags: cleanTags,
    frontImage,
    images,
    weight,
    size,
    age,
    material,
    battery,
    hsnCode,
    styleCode,
    manufacturerAddr,
    packerAddr,
    returnPolicyDays: store.policies?.return_policy || 7,
    shippingTimeDays: store.policies?.shipping_policy || 4,
    dimensions: {
      width: dimensions.width,
      height: dimensions.height,
      depth: dimensions.depth,
    },
    comboType,
    metaTitle: `${name.trim()} | ${brand.trim()}`,
    metaDescription: description.trim().substring(0, 160),
    keywords: cleanTags,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: {
      id: product._id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: product.price,
      finalPrice: product.finalPrice,
      discount: product.discount?.percentage || 0,
      category: categoryDoc.name,
      quantity: product.quantity,
      color: product.color,
      frontImage: product.frontImage.url,
      images: product.images.map(i => i.url),
      rating: product.averageRating,
      tags: product.tags,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      createdAt: product.createdAt,
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productModel
    .findById(req.params.id)
    .populate('categoryId', 'name description');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Product fetched successfully',
    product: {
      id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      finalPrice: product.finalPrice,
      discount: product.discount?.percentage || 0,
      brand: product.brand,
      color: product.color,
      size: product.size,
      material: product.material,
      weight: product.weight,
      battery: product.battery,
      ageGroup: product.age,
      hsnCode: product.hsnCode,
      styleCode: product.styleCode,
      comboType: product.comboType,
      quantity: product.quantity,
      stockStatus: product.stockStatus,
      frontImage: product.frontImage?.url,
      images: product.images.map(img => img.url),
      tags: product.tags,
      category: product.categoryId?.name,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  let { page = 1, limit = 20, search, category } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.categoryId = category;
  }

  const products = await productModel
    .find(query)
    .populate('categoryId', 'name description')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await productModel.countDocuments(query);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    meta: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
    products: products.map(product => ({
      id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      finalPrice: product.finalPrice,
      discount: product.discount?.percentage || 0,
      brand: product.brand,
      color: product.color,
      frontImage: product.frontImage?.url,
      category: product.categoryId?.name,
      tags: product.tags,
      stockStatus: product.stockStatus,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      createdAt: product.createdAt,
    })),
  });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const category = await categoryModel.findById(categoryId);
  if (!category) throw new AppError('Category not found', 404);

  const products = await productModel
    .find({ categoryId })
    .populate('categoryId', 'name description')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `Products in category "${category.name}" fetched successfully`,
    category: {
      id: category._id,
      name: category.name,
      description: category.description,
    },
    products: products.map(product => ({
      id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      finalPrice: product.finalPrice,
      discount: product.discount?.percentage || 0,
      brand: product.brand,
      color: product.color,
      frontImage: product.frontImage?.url,
      tags: product.tags,
      stockStatus: product.stockStatus,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      createdAt: product.createdAt,
    })),
  });
});

// ====== Get products by seller ID (admin or other) ======
export const getProductsBySellerId = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;

  const products = await productModel
    .find({ sellerId })
    .populate('categoryId', 'name description')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `Products for seller fetched successfully`,
    products: products.map(p => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      finalPrice: p.finalPrice,
      discount: p.discount?.percentage || 0,
      brand: p.brand,
      frontImage: p.frontImage?.url,
      stockStatus: p.stockStatus,
      category: p.categoryId?.name,
      createdAt: p.createdAt,
    })),
  });
});

// ====== Get products for logged-in seller ======
export const getProductsBySeller = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const products = await productModel
    .find({ sellerId })
    .populate('categoryId', 'name description')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: `Your products fetched successfully`,
    products: products.map(p => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      finalPrice: p.finalPrice,
      discount: p.discount?.percentage || 0,
      brand: p.brand,
      frontImage: p.frontImage?.url,
      stockStatus: p.stockStatus,
      category: p.categoryId?.name,
      createdAt: p.createdAt,
    })),
  });
});

// ====== Search products ======
export const searchProducts = asyncHandler(async (req, res) => {
  const searchTerm = req.params.id.trim();
  if (!searchTerm) throw new AppError('Search term cannot be empty', 400);

  const products = await productModel
    .find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { slug: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [searchTerm.toLowerCase()] } },
      ],
    })
    .populate('categoryId', 'name slug description')
    .sort({ createdAt: -1 })
    .limit(50); // limit results for performance

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    products: products.map(p => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      finalPrice: p.finalPrice,
      discount: p.discount?.percentage || 0,
      brand: p.brand,
      frontImage: p.frontImage?.url,
      stockStatus: p.stockStatus,
      category: p.categoryId?.name,
      tags: p.tags,
      createdAt: p.createdAt,
    })),
  });
});

// ====== Get products count by status for logged-in seller ======
export const getProductsByStatusForSeller = asyncHandler(async (req, res) => {
  const sellerId = req.user?._id;

  const [pending, shipped, delivered, cancelled] = await Promise.all([
    productModel.countDocuments({ sellerId, status: 'Pending' }),
    productModel.countDocuments({ sellerId, status: 'Shipped' }),
    productModel.countDocuments({ sellerId, status: 'Delivered' }),
    productModel.countDocuments({ sellerId, status: 'Cancelled' }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Product status counts fetched successfully',
    products: { pending, shipped, delivered, cancelled },
  });
});

// ====== Update Product ======
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    quantity,
    color,
    tags,
    weight,
    dimensions,
    productId,
  } = req.body;

  const sellerId = req.user._id;

  const product = await productModel.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  if (product.sellerId.toString() !== sellerId.toString()) {
    throw new AppError('You are not authorized to update this product', 403);
  }

  // Handle front image upload
  if (req.files?.frontImage?.length) {
    const result = await uploadOnCloudinary(req.files.frontImage[0].path);
    if (!result.success) throw new AppError('Front image upload failed', 500);

    product.frontImage = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  // Handle additional images
  if (req.files && req.files.length > 0) {
    const imageFiles = req.files.filter(f => f.fieldname !== 'frontImage');
    const uploadPromises = imageFiles.map(file => uploadOnCloudinary(file.path));
    const results = await Promise.all(uploadPromises);

    results.forEach(result => {
      if (result.success) {
        product.images.push({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    });
  }

  // Update other fields
  if (name) product.name = name;
  if (description) product.description = description;
  if (quantity !== undefined) product.quantity = quantity;
  if (color) product.color = color;
  if (tags) product.tags = tags;
  if (weight) product.weight = weight;
  if (dimensions) product.dimensions = dimensions;

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product: {
      id: updatedProduct._id,
      name: updatedProduct.name,
      slug: updatedProduct.slug,
      description: updatedProduct.description,
      price: updatedProduct.price,
      finalPrice: updatedProduct.finalPrice,
      discount: updatedProduct.discount?.percentage || 0,
      stockStatus: updatedProduct.stockStatus,
      frontImage: updatedProduct.frontImage?.url,
      images: updatedProduct.images?.map(img => img.url),
      tags: updatedProduct.tags,
      category: updatedProduct.categoryId,
      updatedAt: updatedProduct.updatedAt,
    },
  });
});

// ====== Delete Product ======
export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.user._id;

  const product = await productModel.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  if (product.sellerId.toString() !== sellerId.toString()) {
    throw new AppError('You are not authorized to delete this product', 403);
  }

  await productModel.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

