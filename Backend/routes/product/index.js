import {Router} from 'express'
import  addProductRoutes  from './create.routes.js'
import  productRoutes  from './get.routes.js'

const router = Router();

router.use('/update', addProductRoutes);
router.use('/', productRoutes);


export default router;