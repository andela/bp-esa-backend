import axios from 'axios';
import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config();

// redis setup
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
client.on('connect', () => {
  console.log('Redis client connected');
});
client.on('error', (err) => {
  console.log(`Something went wrong ${err}`);
});

// axios base URL and Authorization header setup
axios.defaults.baseURL = 'https://api-prod.andela.com/';
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

export const placementStatus = {
  rollingOff: 'External Engagements - Rolling Off',
  onboarding: 'Placed - Awaiting Onboarding',
};

// Updates the local redis store with latest Partner List
export const updatePartnerStore = async () => {
  axios.get('api/v1/partners')
    .then((response) => {
      client.set('partners', JSON.stringify(response.data), redis.print);
    })
    .catch(error => error.message)
    .finally(() => client.quit());
};

// Finds a partner using partnerId
export const findPartnerById = partnerId => new Promise((resolve, reject) => {
  client.get('partners', (error, result) => {
    client.quit();
    if (error) {
      reject(error);
    }
    resolve(JSON.parse(result).values.filter(partner => partner.id === partnerId));
  });
});


// fetches placements based on status you passed
export const fetchPlacementsByStatus = (status, callback) => {
  axios.get(`api/v1/placements?status=${status}`)
    .then((response) => {
      callback(null, response.data.values);
    })
    .catch(error => callback(error, []))
    .finally(() => client.quit());
};

export const fetchNewKickoffAllocation = (callback) => {
  fetchPlacementsByStatus(placementStatus.onboarding, (err, response) => {
    if (err) {
      callback(err, []);
      return;
    }
    const currentDate = new Date(Date.now());
    const fromDate = currentDate.setDate(
      currentDate.getDate() - Number(process.env.NUMBER_OF_DAYS),
    ); // Specify desired date relative to present day
    const newKickofEngagements = response.filter(data => (Date.parse(data.updated_at) >= fromDate));
    callback(null, newKickofEngagements);
  });
};
