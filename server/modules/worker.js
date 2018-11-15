import client from '../helpers/redis';

client.set('startTime', JSON.stringify(new Date()));

export default () => {
  // Set start time for the worker
  client.get('jobDone', (err, value) => {
    const count = Number(value) || 0;
    client.set('jobDone', count + 1);
  });

  // Perform other operarions - ensure to set status of opreation
  client.set('message', 'Successfull');
};
