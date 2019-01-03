import express from 'express';
import automationController from '../controllers/automationController';

const router = express.Router();

router.get('/', automationController.getAutomations);

export default router;
