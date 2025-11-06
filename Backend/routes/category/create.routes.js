import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/index.js";
import {protect} from "../../middlewares/authHandler.js";

const router = express.Router();

router.post('/create', protect, createCategory); 
router.put('/update/:id', protect, updateCategory);
router.delete('/delete/:id', protect, deleteCategory);


export default router;