import express from 'express';
import dashboardController from '../controllers/dashboardController';
import authenticateUser from '../middleware/auth';

const router = express.Router();

router.get('/upselling-partners', dashboardController.getUpsellingPartners);
router.get('/partner-stats', dashboardController.getPartnerStats);
router.get('/trends', authenticateUser, dashboardController.getEngagementTends);

<<<<<<< HEAD
=======
router.get('/trends', authenticateUser, dashboardController.getEngagementTends);

>>>>>>> feat(dashboard): create an endpoint for engagement trends
export default router;
