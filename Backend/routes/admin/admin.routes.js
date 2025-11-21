import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsBySellerId,
  getAllUsers,
  getAllProducts,
  getAllSellers,
  updateOrderStatusByAdmin,
  updateUserProfileByAdmin,
  updateUserPasswordByAdmin,
  updateSellerByAdmin,
  updateSellerPassByAdmin,
  getSellerByIdAdmin,
  getUserByIdAdmin,
  getOrdersById,
  blockUserByAdmin,
  blockSellerByAdmin,
  deleteProductByAdmin,
  getAllOrders,
  updateProductByAdmin,
} from "../../controllers/index.js";
import {protect} from "../../middlewares/authHandler.js";

const router = express.Router();

router.post('/category', protect, createCategory); 

router.get('/users', protect, getAllUsers);
router.get('/sellers', protect, getAllSellers);
router.get('/products', protect, getAllProducts);
router.get("/orders/getAll", protect, getAllOrders);
router.put("/orders/update", protect, updateOrderStatusByAdmin);



router.put("/user/update-profile", protect, updateUserProfileByAdmin);
router.put("/user/update-pass", protect, updateUserPasswordByAdmin);
router.put("/seller/update-profile", protect, updateSellerByAdmin);
router.put("/seller/update-pass", protect, updateSellerPassByAdmin);
router.put("/product/update", protect, updateProductByAdmin);
router.get('/seller/:id', protect, getProductsBySellerId);

router.put('/category/:id', protect, updateCategory);
router.delete('/category/:id', protect, deleteCategory);

router.get("/user/getUserById/:id", protect, getUserByIdAdmin);
router.get("/seller/getSellerById/:id", protect, getSellerByIdAdmin);

router.get("/orders/getById/:id", protect, getOrdersById);
router.put("/user/blocked/:id", protect, blockUserByAdmin);
router.put("/seller/blocked/:id", protect, blockSellerByAdmin);
router.delete("/products/delete/:id", protect, deleteProductByAdmin);


export default router;
