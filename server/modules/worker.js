import client from '../helpers/redis';

export default {
  init: () => {
    client.set('startTime', JSON.stringify(new Date()));
  },
  exec: () => {
    // Set start time for the worker
    client.get('numberOfJobs', (err, value) => {
      const count = Number(value) || 0;
      client.set('numberOfJobs', count + 1);
    });

    // Perform other operarions - ensure to set status of opreation
    client.set('message', 'Successfull');
  },
};
