import express from 'express';
import automationController from '../controllers/automationController';
import automationStatusController from '../controllers/automationStatsController';

const router = express.Router();

router.get('/', automationController.getAutomations);
router.get('/stats', automationStatusController);

export default router;
