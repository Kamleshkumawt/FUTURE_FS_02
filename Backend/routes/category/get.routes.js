import { Router } from "express";
import { getAllCategories, getAllCategoriesForSeller, getCategoriesByParentId, getCategoryById} from "../../controllers/index.js";
import { protect } from "../../middlewares/index.js";

const router = Router();

// Public routes
router.get('/get/all', protect, getAllCategoriesForSeller); // Get all categories, optional query: includeSub, status
router.get('/all', getAllCategories); // Get all categories, optional query: includeSub, status
router.get('/:id', getCategoryById); // Get category by ID
router.get('/parentId/:id', getCategoriesByParentId); // Get category by ID

export default router;