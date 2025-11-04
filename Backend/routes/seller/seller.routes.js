import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, getProductsBySeller, getProductsByStatusForSeller, searchProducts, updateProduct} from "../../controllers/index.js";
import { protect } from "../../middlewares/index.js";
import upload from "../../middlewares/multerHandler.js";

const router = Router();

// ================== Public Routes ==================

// Get all products with pagination, search, filter
router.get('/', getProducts); // /api/products?page=1&limit=20&search=phone&category=ID

// Get product by slug (SEO-friendly)
router.get('/slug/:slug', async (req, res, next) => {
  req.params.id = req.params.slug; // adapt slug to your controller logic if needed
  return getProductById(req, res, next);
});

// Get products by category (SEO-friendly)
router.get('/category/:id', getProductsByCategory);

// Search products
router.get('/search/:id', searchProducts);

// ================== Seller Routes ==================

// Get products for logged-in seller
router.get('/seller/me', protect, getProductsBySeller);

// Get product status counts for logged-in seller
router.get('/seller/me/status', protect, getProductsByStatusForSeller);

// ================== Protected / Admin Routes ==================

// Create product
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  createProduct
);

// Update product
router.put(
  '/',
  protect,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  updateProduct
);

// Delete product
router.delete('/:id', protect, deleteProduct);

export default router;