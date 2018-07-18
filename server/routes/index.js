import { Router } from 'express';
import slackService from '../../slackService/index';

const router = Router();

router.post('/onboarding', (req, res) => {
  const { user_email } = req.body;
  slackService.onboardingAutomation(user_email);
  res.send('Slack Service Started onboarding').end();
});

export default router;
