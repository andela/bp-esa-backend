import client from '../helpers/redis';
// eslint-disable-next-line import/no-cycle
import executeJobs from './index';

export default {
  init: () => {
    // Set start time for the worker
    client.set('startTime', JSON.stringify(new Date()));
    client.set('numberOfJobs', 0);
  },
  exec: () => {
    executeJobs('offboarding');
    executeJobs('onboarding');
  },
};
