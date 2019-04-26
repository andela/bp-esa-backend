import mockAndelAPI from '../mockAndelaApi';
import automationsAPI from './automationRouter';
import workerStatus from '../controllers/workerStatus';
import authApi from '../controllers/authController';

export default (app) => {
  app.get('/worker-status', workerStatus);
  app.use('/mock-api', mockAndelAPI);
  app.use('/api/v1/automations', automationsAPI);
  app.post('/api/v1/auth', authApi);
};
