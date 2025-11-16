import productModel from '../../models/product.model.js';
import categoryModel from '../../models/category.model.js';
import sellerModel from '../../models/seller.model.js';
import uploadOnCloudinary from '../../config/cloudinary.js';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { AppError } from '../../utils/appError.js';
import slugify from 'slugify';
import mongoose from 'mongoose';

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
    keywords,
    gender,
  } = req.body;

  const sellerId = req.user?._id;

  if (!name || !price || !description || !category || !quantity || !color || !brand ||
      !weight || !dimensions || !size || !material || !battery || !age ||
      !hsnCode || !comboType || !manufacturerAddr || !packerAddr || !gender || !gstNumber || !keywords) {
    throw new AppError('Please provide all required fields', 400);
  }

  if (description.length < 10 || description.length > 1000)
    throw new AppError('Description must be between 10 and 1000 characters', 400);

  if (price <= 0 || quantity <= 0)
    throw new AppError('Price and quantity must be positive numbers', 400);

  const store = await sellerModel.findById(sellerId);
  // console.log('store', store)
  if (!store) throw new AppError('Seller not found', 404);

  if (store.storeName !== brand.trim())
    throw new AppError('Brand mismatch with seller store name', 400);

  if (store.gstNumber !== gstNumber.trim())
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


  const dimensionss = JSON.parse(dimensions);
  const manufacturerAddrs = JSON.parse(manufacturerAddr);
  const packerAddrs = JSON.parse(packerAddr);

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
    manufacturerAddr:manufacturerAddrs,
    packerAddr:packerAddrs,
    returnPolicyDays: store.policies?.returnPolicy || 7,
    shippingTimeDays: store.policies?.shippingPolicy || 4,
    dimensions: {
      width: dimensionss.width,
      height: dimensionss.height,
      depth: dimensionss.depth,
    },
    comboType,
    metaTitle: `${name.trim()} | ${brand.trim()}`,
    metaDescription: description.trim().substring(0, 160),
    keywords: cleanTags,
    gender,
    sku:'TSHIRT-001',
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
  const { slug } = req.params;

  const query = mongoose.Types.ObjectId.isValid(slug)
  ? { _id: slug }
  : { slug };

  const product = await productModel
    .findOne(query)
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
      color: product.color,
      size: product.size,
      material: product.material,
      weight: product.weight,
      ageGroup: product.age,
      hsnCode: product.hsnCode,
      styleCode: product.styleCode,
      comboType: product.comboType,
      quantity: product.quantity,
      rating: product.averageRating,
      numOfReviews: product.numOfReviews,
      frontImage: product.frontImage?.url,
      images: product.images.map(img => img.url),
      tags: product.tags,
      category: product.categoryId?.name,
      dimensions: product.dimensions,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  let  page = 1; 
  let limit = 50 ;
  page = parseInt(page);
  limit = parseInt(limit);

  const products = await productModel
    .find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit).populate('categoryId', 'name slug description');

  const total = await productModel.countDocuments();

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
      numOfReviews: product.numOfReviews,
      rating: product.averageRating,
      discount: product.discount?.percentage || 0,
      material:product.material,
      color: product.color,
      comboType: product.comboType,
      gender: product.gender,
      size: product.size,
      frontImage: product.frontImage?.url,
      category: product.categoryId,
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
      numOfReviews: product.numOfReviews,
      rating: product.averageRating,
      discount: product.discount?.percentage || 0,
      material:product.material,
      color: product.color,
      comboType: product.comboType,
      gender: product.gender,
      size: product.size,
      frontImage: product.frontImage?.url,
      category: product.categoryId,
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
      price: p.price,
      quantity: p.quantity,
      stockStatus: p.stockStatus,
      averageRating: p.averageRating,
      color: p.color,
      numOfReviews: p.numOfReviews,
      weight: p.weight,
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
      numOfReviews: p.numOfReviews,
      rating: p.averageRating,
      discount: p.discount?.percentage || 0,
      material:p.material,
      color: p.color,
      comboType: p.comboType,
      gender: p.gender,
      size: p.size,
      frontImage: p.frontImage?.url,
      category: p.categoryId,
      tags: p.tags,
      stockStatus: p.stockStatus,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
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
    age,
  } = req.body;

  const sellerId = req.user._id;

  const product = await productModel.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  if (product.sellerId.toString() !== sellerId.toString()) {
    throw new AppError('You are not authorized to update this product', 403);
  }


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

  // console.log('📸 Uploading images to Cloudinary req.files', req?.files);
  if (req.files?.frontImage?.[0]) {
    product.frontImage = await uploadImage(req.files.frontImage?.[0]);
  }

 if (req.files?.images?.length) {
  const uploadedImages = await Promise.all(
    req.files.images.map(file => uploadImage(file))
  );

  // console.log('📸 Uploaded images to Cloudinary before : ', uploadedImages);

  product.images = uploadedImages.map(img => ({
    url: img.url,
    publicId: img.publicId,
    width: img.width,
    height: img.height,
    format: img.format,
    bytes: img.bytes,
  }));
  // console.log("📸 Uploaded images to Cloudinary successfully", product.images);
}


  // Handle front image upload
  // if (req.files?.frontImage?.length) {
  //   const result = await uploadOnCloudinary(req.files.frontImage[0].path);
  //   if (!result.success) throw new AppError('Front image upload failed', 500);

  //   product.frontImage = {
  //     url: result.secure_url,
  //     publicId: result.public_id,
  //     width: result.width,
  //     height: result.height,
  //     format: result.format,
  //     bytes: result.bytes,
  //   };
  // }

  // Handle additional images
  // console.log('req.files', req.files);
  // if (req.files) {
  //   console.log('📸 Uploading images to Cloudinary...',req.files);
  //   const imageFiles = req.files.filter(f => f.fieldname !== 'frontImage');
  //   console.log(`📸 Uploading ${imageFiles.length} images to Cloudinary...`,imageFiles);
  //   const uploadPromises = imageFiles.map(file => uploadOnCloudinary(file.path));
  //   const results = await Promise.all(uploadPromises);
  //   console.log('📸 Image upload results:', results);
  //   results.forEach(result => {
  //     if (result.success) {
  //       product.images.push({
  //         url: result.secure_url,
  //         publicId: result.public_id,
  //         width: result.width,
  //         height: result.height,
  //         format: result.format,
  //         bytes: result.bytes,
  //       });
  //     }
  //   });
  // }

  // Update other fields
  if (name) product.name = name;
  if (description) product.description = description;
  if (quantity !== undefined) product.quantity = quantity;
  if (color) product.color = color;
  if (tags) product.tags = JSON.parse(tags);
  if (weight) product.weight = weight;
  if (dimensions) product.dimensions = JSON.parse(dimensions);
  if (age) product.age = age;

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

