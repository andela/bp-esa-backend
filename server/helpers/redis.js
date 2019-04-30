import redis from 'redis';

// redis setup
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
/* eslint-disable no-console */
client.on('connect', () => {
  console.log('Redis client connected');
});
client.on('error', (err) => {
  console.log(`Something went wrong ${err}`);
});
/* eslint-enable no-console */

export default client;
