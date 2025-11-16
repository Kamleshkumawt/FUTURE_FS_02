import { Router } from 'express';
import userRoutes from './user/index.js'
import sellerRoutes from './seller/index.js'
import adminRoutes from './admin/index.js'
import productRoutes from './product/index.js'
import categoryRoutes from './category/index.js'
import orderRoutes from './order/index.js'

const router = Router();

router.use('/user', userRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/order', orderRoutes);

export default router;