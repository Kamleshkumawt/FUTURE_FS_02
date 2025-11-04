import {Router} from 'express'
import  authRoutes  from './auth.routes.js'
import  sellerRoutes  from './seller.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/', sellerRoutes);


export default router;