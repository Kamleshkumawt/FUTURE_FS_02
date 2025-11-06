import {Router} from 'express'
import  addCategoryRoutes  from './create.routes.js'
import  categoryRoutes  from './get.routes.js'

const router = Router();

router.use('/add', addCategoryRoutes);
router.use('/', categoryRoutes);


export default router;