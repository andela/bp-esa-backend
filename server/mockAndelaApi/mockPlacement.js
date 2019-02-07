import faker from 'faker';

const mockPlacement = (status, email) => ({
  id: faker.random.uuid(),
  fellow: {
    id: faker.random.uuid(),
    email,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    location: faker.address.city(),
    level: `D${faker.random.number(5)} Developer`,
    name: faker.fake('{{name.firstName}}, {{name.lastName}}'),
    picture: faker.image.image(),
  },
  fellow_id: faker.random.uuid(),
  status,
  type: 'recommendation',
  client_name: faker.company.companyName(),
  placement_mode: 'recommendation',
  engagement_id: faker.random.uuid(),
  start_date:
    status === 'External Engagements - Rolling Off'
      ? faker.date.past(2019, new Date())
      : faker.date.future(2019, new Date()),
  end_date: faker.date.future(2019, new Date()),
  created_at: new Date(),
  updated_at: new Date(),
  updated_by: 'Feyikemi Olabiyi',
  salesforce_id: '0011a00000CPKyOAAX',
  engagement_role_id: faker.random.uuid(),
  engagement_role: null,
  next_available_date: faker.random.uuid(),
  sync_status: '',
  client_id: '-KXGyJcC1oimjQgFj184',
});

export default mockPlacement;
