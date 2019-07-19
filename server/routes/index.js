import mockAndelAPI from '../mockAndelaApi';
import automationsAPI from './automationRouter';
import workerStatus from '../controllers/workerStatus';
import authApi from '../controllers/authController';
import updatePartnerSlackChannels from '../controllers/partnerController';
import { validatePartner } from '../validator';

export default (app) => {
  app.put('/partners/:id', validatePartner, updatePartnerSlackChannels);
  app.get('/worker-status', workerStatus);
  app.use('/mock-api', mockAndelAPI);
  app.use('/api/v1/automations', automationsAPI);
  app.use('/api/v1/auth', authApi);
};
