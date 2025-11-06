import { Router } from "express";
import { createProduct, deleteProduct,updateProduct} from "../../controllers/index.js";
import { protect } from "../../middlewares/index.js";
import upload from "../../middlewares/multerHandler.js";

const router = Router();
// Create product
router.post(
  '/create-product',
  protect,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  createProduct
);

// Update product
router.put(
  '/update-product',
  protect,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  updateProduct
);

// Delete product
router.delete('/delete-product/:id', protect, deleteProduct);

export default router;