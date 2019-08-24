import faker from 'faker';
import axios from 'axios';
import { redisdb } from '../helpers/redis';

require('dotenv').config();

// Axios authorization header setup
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

/**
 * @desc Retrieves list of partners from andela-staging
 * @returns {Promise} A promise to return a list of andela partners
 */
export async function getAndelaPartners() {
  const partners = await redisdb.get('andela-partners');
  if (!partners) {
    const { data } = await axios.get(`${process.env.ANDELA_PARTNERS}?limit=10`);
    await redisdb.set('andela-partners', JSON.stringify(data.values));
    return data.values;
  }
  return JSON.parse(partners);
}

const mockPlacement = async (status, email) => {
  const mockPartners = await getAndelaPartners();
  // console.log('--->mockPartners--->', mockPartners);
  const partner = mockPartners[faker.random.number(mockPartners.length - 1)];
  return {
    id: faker.random.uuid(),
    fellow: {
      id: faker.random.uuid(),
      email,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      location: faker.address.city(),
      level: `D${faker.random.number(5)} Developer`,
      name: faker.fake('{{name.firstName}}, {{name.lastName}}'),
    },
    fellow_id: faker.random.uuid(),
    status,
    start_date:
      status === 'External Engagements - Rolling Off'
        ? faker.date.past(2019, new Date())
        : faker.date.future(2019, new Date()),
    created_at: new Date(),
    updated_at: new Date(),
    client_name: partner.name,
    client_id: partner.id,
  };
};

export default mockPlacement;
