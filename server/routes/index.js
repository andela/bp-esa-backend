import mockAndelAPI from '../mockAndelaApi';
import automationsAPI from './automationRouter';
import dashboardApi from './dashboardRouter';
import workerStatus from '../controllers/workerStatus';
import authApi from '../controllers/authController';
import updatePartnerSlackChannels from '../controllers/partnerController';
import { validatePartner } from '../validator';
import authenticateUser from '../middleware/auth';

export default (app) => {
  app.put('/partners/:id', authenticateUser, validatePartner, updatePartnerSlackChannels);
  app.get('/worker-status', authenticateUser, workerStatus);
  app.use('/mock-api', mockAndelAPI);
  app.use('/api/v1/automations', automationsAPI);
  app.use('/api/v1/auth', authApi);
  app.use('/api/v1/dashboard', dashboardApi);
};
