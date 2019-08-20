import sinon from 'sinon';
import proxyquire from 'proxyquire';
import executejobs from '../../server/jobs';
import { io } from '../../server';
import { redisdb } from '../../server/helpers/redis';
import slackMocks from '../mocks/slack';
import { slack } from '../../server/modules/slack/slackIntegration';
import email from '../../server/modules/email/emailTransport';

const fakeIoEmit = sinon.spy(io, 'emit');

// const email = proxyquire('../../server/modules/email/emailModule', {
//   './emailTransport': { sendMail: () => sinon.stub() },
// });

const lookupByEmail = sinon.stub(slack, 'lookupByEmail').callsFake(() => slackMocks.slackUser);
const invite = sinon.stub(slack, 'invite').callsFake(() => slackMocks.inviteUser);
const kick = sinon.stub(slack, 'kick').callsFake(() => slackMocks.removeUser);
const create = sinon.stub(slack, 'createChannel').callsFake(() => slackMocks.createGroups);
const info = sinon.stub(slack, 'channelInfo').callsFake(() => slackMocks.groupInfo);
const listChannels = sinon.stub(slack, 'listChannels').callsFake(() => slackMocks.channelList);
const sendMail = sinon.stub(email, 'sendMail').callsFake(() => {});

describe('Jobs Execution Test Suite', async () => {
  it('should execute onboarding jobs successfully', async () => {
    // get automations from db and assert that parent data matches the newPlacements
    await redisdb.delete('andela-partners');
    await executejobs('onboarding');
    sinon.assert.called(fakeIoEmit);

    fakeIoEmit.restore();
    lookupByEmail.restore();
    invite.restore();
    kick.restore();
    create.restore();
    info.restore();
    listChannels.restore();
    sendMail.restore();
  }).timeout(30 * 1000);
});
