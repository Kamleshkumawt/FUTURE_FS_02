import { Router } from "express";
import { getProductById, getProducts, getProductsByCategory, getProductsBySeller, getProductsByStatusForSeller, searchProducts} from "../../controllers/index.js";
import { protect } from "../../middlewares/index.js";

const router = Router();

// ================== Public Routes ==================

// Get all products with pagination, search, filter
router.get('/get/all', getProducts); // /api/products?page=1&limit=20&search=phone&category=ID

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
router.get('/get/sellerId', protect, getProductsBySeller);

// Get product status counts for logged-in seller
router.get('/getProduct/status', protect, getProductsByStatusForSeller);

export default router;