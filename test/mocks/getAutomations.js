import faker from 'faker';

const dateFrom = new Date('January 31 2019 12:30');
const dateTo = new Date('March 31 2019 12:30');

/**
 * @desc Automates creation of fake automation data
 * @returns {Array} list of dummy automations
 */
const createAutomationFakeData = () => {
  const dummyAutomations = [];
  for (let i = 0; dummyAutomations.length < 10; i++) {
    const dummyAutomation = {
      id: i + 1,
      placementId: faker.random.uuid(),
      fellowName: `${faker.name.firstName()}, ${faker.name.lastName()}`,
      fellowId: faker.random.uuid(),
      email: null,
      partnerName: faker.company.bsNoun(),
      partnerId: faker.random.uuid(),
      type: faker.random.arrayElement(['offboarding', 'onboarding']),
      createdAt: faker.date.between(new Date('January 31 2019 12:30'), new Date('March 31 2019 12:30')),
      updatedAt: faker.date.between(new Date('January 31 2019 12:30'), new Date('March 31 2019 12:30')),
    };
    dummyAutomations.push(dummyAutomation);
  }
  return dummyAutomations;
};

/**
 * @desc Automates creation of fake slackAutomation data
 * @param {function} dummyAutomationsFunc - returned data from Automation model
 * @returns {Array} list of dummy sackAutomation
 */
const createSlackAutomation = (dummyAutomationsFunc) => {
  const slackAutomationsDummyData = [];
  for (let i = 0; i < dummyAutomationsFunc.length; i++) {
    const dummySlack = {
      id: i + 1,
      channelId: faker.random.arrayElement([null, faker.random.uuid()]),
      channelName: faker.company.bsNoun(),
      status: faker.random.arrayElement(['success', 'failure']),
      statusMessage: faker.random.words(8),
      slackUserId: faker.random.arrayElement([null, faker.random.uuid()]),
      type: faker.random.arrayElement(['invite', 'kick', 'create']),
      automationId: dummyAutomationsFunc[i].id,
      createdAt: faker.date.between(dateFrom, dateTo),
      updatedAt: faker.date.between(dateFrom, dateTo),
    };
    slackAutomationsDummyData.push(dummySlack);
  }
  return slackAutomationsDummyData;
};

/**
 * @desc Automates creation of fake freckleAutomation data
 * @param {function} dummyAutomationsFunc - returned data from Automation model
 * @returns {Array} list of dummy freckleAutomation
 */
const createFreckleAutomation = (dummyAutomationsFunc) => {
  const freckleAutomationsDummyData = [];
  for (let i = 0; i < dummyAutomationsFunc.length; i++) {
    const dummyFreckle = {
      id: i + 1,
      freckleUserId: null,
      projectId: null,
      status: faker.random.arrayElement(['success', 'failure']),
      statusMessage: faker.random.words(8),
      slackUserId: faker.random.arrayElement([null, faker.random.uuid()]),
      type: faker.random.arrayElement(['projectCreation', 'projectAssignment']),
      automationId: dummyAutomationsFunc[i].id,
      createdAt: faker.date.between(dateFrom, dateTo),
      updatedAt: faker.date.between(dateFrom, dateTo),
    };
    freckleAutomationsDummyData.push(dummyFreckle);
  }
  return freckleAutomationsDummyData;
};

/**
 * @desc Automates creation of fake emailAutomation data
 * @param {function} dummyAutomationsFunc - returned data from Automation model
 * @returns {Array} list of dummy emailAutomation
 */
const createEmailAutomation = (dummyAutomationsFunc) => {
  const emailAutomationsDummyData = [];
  for (let i = 0; i < dummyAutomationsFunc.length; i++) {
    const dummyEmail = {
      id: i + 1,
      status: faker.random.arrayElement(['success', 'failure']),
      statusMessage: faker.random.words(8),
      body: faker.random.words(8),
      recipient: faker.internet.email(),
      sender: faker.internet.email(),
      subject: faker.random.words(5),
      automationId: dummyAutomationsFunc[i].id,
      createdAt: faker.date.between(dateFrom, dateTo),
      updatedAt: faker.date.between(dateFrom, dateTo),
    };
    emailAutomationsDummyData.push(dummyEmail);
  }
  return emailAutomationsDummyData;
};
export {
  createAutomationFakeData as default,
  createSlackAutomation,
  createFreckleAutomation,
  createEmailAutomation,
};
