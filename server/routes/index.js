import mockAndelAPI from '../mockAndelaApi';
import automationsAPI from './automationRouter';
import workerStatus from '../controllers/workerStatus';

export default (app) => {
  app.get('/worker-status', workerStatus);
  app.use('/mock-api/api/v1', mockAndelAPI);
  app.use('/api/v1/automations', automationsAPI);
};
