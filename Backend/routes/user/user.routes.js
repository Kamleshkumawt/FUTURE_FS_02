import { Router } from 'express';
import {
    addItemToCart,
 clearCart,
 createReview,
 deleteReview,
 getCart,
 getReviewsByProductId,
 removeCartItem,
 updateCartItem
} from '../../controllers/index.js';
import { protect } from '../../middlewares/index.js';
import upload from '../../middlewares/multerHandler.js'

const router = Router();

// Get a user's cart
router.get('/cart/get', protect, getCart);

// Add item to cart
router.post('/cart/add', protect, addItemToCart);

// Update item quantity in cart
router.put('/cart/update', protect, updateCartItem);

// Remove a single item from cart
router.delete('/cart/:productId', protect, removeCartItem);

// Clear entire cart
router.delete('/cart/clear', protect, clearCart);


// Create a new review (with optional images)
router.post('/', protect, upload.array('images', 5), createReview);

// Get all reviews for a specific product
router.get('/product/:productId', getReviewsByProductId);

// Delete a review (only owner or admin can delete)
router.delete('/:id', protect, deleteReview);


// // Public routes
// router.get('/', getAllCategories); // Get all categories, optional query: includeSub, status
// router.get('/category/:id', getCategoryById); // Get category by ID
// router.get('/category/parentId/:id', getCategoriesByParentId); // Get category by ID



export default router;
