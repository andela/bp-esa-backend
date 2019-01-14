import sinon from 'sinon';
import proxyquire from 'proxyquire';
import client from '../../server/helpers/redis';
import { rawAllocations, onboardingAllocations } from '../mocks/allocations';
import slackMocks from '../mocks/slack';

const createOrUpdateSlackAutomation = sinon.stub();
const getSlackAutomation = sinon.stub();

const slack = proxyquire('../../server/modules/slack/slackIntegration', {
  '../automations': {
    createOrUpdateSlackAutomation,
    getSlackAutomation,
  },
});

const fakeSlackClient = {
  get: sinon.stub(client, 'get').callsFake((value, cb) => cb.apply(this, [null, rawAllocations])),
  lookupByEmail: sinon
    .stub(slack.slackClient.users, 'lookupByEmail')
    .callsFake(() => slackMocks.slackUser),
  invite: sinon.stub(slack.slackClient.groups, 'invite').callsFake(() => slackMocks.inviteUser),
  kick: sinon.stub(slack.slackClient.groups, 'kick').callsFake(() => slackMocks.removeUser),
  create: sinon.stub(slack.slackClient.groups, 'create').callsFake(() => slackMocks.createGroups),
};

/* eslint-disable no-unused-expressions */

describe('Slack Integration Test Suite', async () => {
  beforeEach(() => {
    Object.keys(fakeSlackClient).forEach(fake => fakeSlackClient[fake].resetHistory());
    createOrUpdateSlackAutomation.resetHistory();
    getSlackAutomation.resetHistory();
  });

  it('Should create internal slack channels and save the automation to DB', async () => {
    const { data } = onboardingAllocations;
    const { client_name: partnerName } = data.values[0];
    const createResult = await slack.createPartnerChannel(partnerName, 'internal');
    const expectedResult = {
      id: slackMocks.createGroups.group.id,
      name: slackMocks.createGroups.group.name,
    };
    expect(createOrUpdateSlackAutomation.calledOnce).to.be.true;
    expect(fakeSlackClient.create.calledOnce).to.be.true;
    expect(createResult.id).to.equal(expectedResult.id);
    expect(createResult.name).to.equal(expectedResult.name);
  });
  it('Should create general slack channels and save the automation to DB', async () => {
    const { data } = onboardingAllocations;
    const { client_name: partnerName } = data.values[0];
    const createResult = await slack.createPartnerChannel(partnerName, 'general');
    const expectedResult = {
      id: slackMocks.createGroups.group.id,
      name: slackMocks.createGroups.group.name,
    };
    expect(createOrUpdateSlackAutomation.calledOnce).to.be.true;
    expect(fakeSlackClient.create.calledOnce).to.be.true;
    expect(createResult.id).to.equal(expectedResult.id);
    expect(createResult.name).to.equal(expectedResult.name);
  });
  it('Should add developers to respective channels and save the automation to DB', async () => {
    const email = 'johndoe@mail.com';
    const channel = 'GDL7RDC5V';
    await slack.accessChannel(email, channel, 'invite');
    expect(createOrUpdateSlackAutomation.calledOnce).to.be.true;
    expect(fakeSlackClient.invite.calledOnce).to.be.true;
  });
  it('Should remove developers from channels and save the automation to DB', async () => {
    const email = 'johndoe@mail.com';
    const channel = 'GDL7RDC5V';
    await slack.accessChannel(email, channel, 'kick');
    expect(createOrUpdateSlackAutomation.calledOnce).to.be.true;
    expect(fakeSlackClient.kick.calledOnce).to.be.true;
  });
});
