import sinon from 'sinon';
import executejobs from '../../server/jobs';
import { io } from '../../server';
import { slackClient } from '../../server/modules/slack/slackIntegration';

const ioEmit = sinon.spy(io, 'emit');

const lookupByEmail = sinon.spy(slackClient.users, 'lookupByEmail');
const invite = sinon.spy(slackClient.groups, 'invite');
const kick = sinon.spy(slackClient.groups, 'kick');
const create = sinon.stub(slackClient.groups, 'create');
const groupInfo = sinon.stub(slackClient.groups, 'info');
const fakes = [ioEmit, lookupByEmail, invite, kick, create, groupInfo];
describe('Jobs Execution Test Suite', async () => {
  afterEach(() => {
    fakes.forEach(fake => fake.restore());
  });

  it('should execute onboarding jobs successfully', async () => {
    // get automations from db and test that parent data matches the newPlacements
    await executejobs('onboarding');
    sinon.assert.called(ioEmit);
  });
});
