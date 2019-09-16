import redis from 'redis';
import { promisify } from 'util';
import env from '../validator';

// redis setup
const client = redis.createClient(env.REDIS_PORT, env.REDIS_HOST);

client.on('connect', () => {
  console.log('Redis client connected');
});
client.on('error', (err) => {
  console.log(`Something went wrong ${err}`);
});
export const redisdb = {
  set: promisify(client.set).bind(client),
  get: promisify(client.get).bind(client),
  scan: promisify(client.scan).bind(client),
  delete: promisify(client.del).bind(client),
  clear: promisify(client.flushdb).bind(client),
};

export default client;
