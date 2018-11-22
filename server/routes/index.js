import client from '../helpers/redis';

import daysBetween from '../helpers/daysBetween';

export default (app) => {
  app.get('/worker-status', (req, res) => client.mget('startTime', 'message', 'numberOfJobs', (err, response) => {
    if (err) {
      return res.status(400).send({
        message: 'Error with redis connection, kindly connect to redis',
      });
    }

    const startTime = new Date(JSON.parse(response[0]));
    const [message, numberOfJobs] = response;

    return res.status(200).send({
      message,
      numberOfJobs, // no of times the worker executed,
      upTime: daysBetween(startTime, new Date()), // the time value since the worker started ,
      startTime: startTime.toLocaleDateString(), // the time stamp the worker started,
    });
  }));
};
