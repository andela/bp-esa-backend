import sinon from 'sinon';
import * as slack from '../../server/modules/slack/slackIntegration';
import client from '../../server/helpers/redis';
import { rawAllocations, onboardingAllocations } from '../mocks/allocations';
import slackMocks from '../mocks/slack';
import models from '../../server/models';

const fakeModels = {
  SlackAutomation: sinon.spy(models.SlackAutomation, 'create'),
};

const fakeSlackClient = {
  get: sinon
    .stub(client, 'get')
    .callsFake((value, cb) => cb.apply(this, [null, rawAllocations])),
  lookupByEmail: sinon
    .stub(slack.slackClient.users, 'lookupByEmail')
    .callsFake(() => slackMocks.slackUser),
  invite: sinon
    .stub(slack.slackClient.groups, 'invite')
    .callsFake(() => slackMocks.inviteUser),
  kick: sinon
    .stub(slack.slackClient.groups, 'kick')
    .callsFake(() => slackMocks.removeUser),
  create: sinon
    .stub(slack.slackClient.groups, 'create')
    .callsFake(() => slackMocks.createGroups),
};

describe('Slack Integration Test Suite', async () => {
  beforeEach(() => {
    Object.keys(fakeModels).forEach(fake => fakeModels[fake].resetHistory());
    Object.keys(fakeSlackClient).forEach(fake => fakeSlackClient[fake].resetHistory());
  });

  it('Should create internal slack channels for a new partner', async () => {
    const { data } = onboardingAllocations;
    const { client_name: partnerName } = data.values[0];
    const createResult = await slack.createPartnerChannel(partnerName, 'internal');
    const expectedResult = {
      id: slackMocks.createGroups.group.id,
      name: slackMocks.createGroups.group.name,
    };
    expect(fakeModels.SlackAutomation.calledOnce);
    expect(fakeSlackClient.create.calledOnce);
    expect(createResult.id).to.equal(expectedResult.id);
    expect(createResult.name).to.equal(expectedResult.name);
  });
  it('Should create general slack channels for a new partner', async () => {
    const { data } = onboardingAllocations;
    const { client_name: partnerName } = data.values[0];
    const createResult = await slack.createPartnerChannel(partnerName, 'general');
    const expectedResult = {
      id: slackMocks.createGroups.group.id,
      name: slackMocks.createGroups.group.name,
    };
    expect(models.SlackAutomation.create.calledOnce);
    expect(fakeSlackClient.create.calledOnce);
    expect(createResult.id).to.equal(expectedResult.id);
    expect(createResult.name).to.equal(expectedResult.name);
  });
  it('Should add developers to respective channels', async () => {
    const email = 'johndoe@mail.com';
    const channel = 'GDL7RDC5V';
    await slack.accessChannel(email, channel, 'invite');
    expect(fakeModels.SlackAutomation.calledOnce);
    expect(fakeSlackClient.invite.calledOnce);
  });
  it('Should remove developers from channels', async () => {
    const email = 'johndoe@mail.com';
    const channel = 'GDL7RDC5V';
    await slack.accessChannel(email, channel, 'kick');
    expect(fakeModels.SlackAutomation.calledOnce);
    expect(fakeSlackClient.kick.calledOnce);
  });
});
