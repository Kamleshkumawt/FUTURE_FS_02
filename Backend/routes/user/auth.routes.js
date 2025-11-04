import { Router } from 'express';
import {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  updateProfilePasswordController,
  logoutController,
} from '../../controllers/index.js';
import { protect } from '../../middlewares/index.js';
import upload from '../../middlewares/multerHandler.js'

const router = Router();


// ==================== PUBLIC ROUTES ==================== //
router.post('/register', registerController);
router.post('/login', loginController);

// ==================== PROTECTED ROUTES ==================== //
router.use(protect);

router.post('/logout', logoutController);
router.get('/me', getProfileController);
router.put('/update', upload.single('profile_picture'), updateProfileController);
router.put('/update-password', updateProfilePasswordController);

export default router;
