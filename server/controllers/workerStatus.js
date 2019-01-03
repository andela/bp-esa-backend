import client from '../helpers/redis';
import daysBetween from '../helpers/daysBetween';

/**
 * @desc Gets worker status and returns to user
 *
 * @param {object} req Request object from client
 * @param {object} res REST Response object
 * @returns {object} Response containing worker status message, numberOfjobs, uptime and startTime
 */
export default (req, res) => client.mget('startTime', 'message', 'numberOfJobs', (err, response) => {
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
});
