import client from '../helpers/redis';
import daysBetween from '../helpers/daysBetween';
import mockAndelAPI from '../mockAndelaApi';

export default (app) => {
  app.get('/worker-status', (req, res) => client.mget('startTime', 'message', 'numberOfJobs', (err, response) => {
    if (err) {
      return res.status(400).send({
        message: 'Error with redis connection, kindly connect to redis',
      });
    }

    const [startTimeRaw, message, numberOfJobs] = response;
    const startTime = new Date(JSON.parse(startTimeRaw));

    return res.status(200).send({
      message,
      numberOfJobs, // no of times the worker executed,
      upTime: daysBetween(startTime, new Date()), // the time value since the worker started ,
      startTime: startTime.toLocaleDateString(), // the time stamp the worker started,
    });
  }));

  app.use('/mock-api/api/v1', mockAndelAPI);
};
