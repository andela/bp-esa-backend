import express from 'express';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/upselling-partners', dashboardController.getUpsellingPartners);
router.get('/partner-stats', dashboardController.getPartnerStats);


export default router;
