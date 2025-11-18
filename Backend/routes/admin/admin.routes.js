import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsBySellerId,
  getAllUsers,
  getAllProducts,
  getAllSellers,
} from "../../controllers/index.js";
import {protect} from "../../middlewares/authHandler.js";

const router = express.Router();

router.post('/category/', protect, createCategory); 
router.put('/category/:id', protect, updateCategory);
router.delete('/category/:id', protect, deleteCategory);

router.get('/seller/:id', protect, getProductsBySellerId);

router.get('/users', protect, getAllUsers);
router.get('/sellers', protect, getAllSellers);
router.get('/products', protect, getAllProducts);


export default router;
