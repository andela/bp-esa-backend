import express from 'express';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/upselling-partners', dashboardController.getUpsellingPartners);

export default router;
