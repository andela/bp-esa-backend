import sinon from 'sinon';
import executejobs from '../../server/jobs';
import { io } from '../../server';
import { redisdb } from '../../server/helpers/redis';
import slackMocks from '../mocks/slack';
import { slack } from '../../server/modules/slack/slackIntegration';
import email from '../../server/modules/email/emailTransport';

const ioDotEmit = sinon.spy(io, 'emit');
const sendMail = sinon.spy(email, 'sendMail');

describe('Jobs Execution Test Suite', async () => {
  it('should execute onboarding jobs successfully', async () => {
    // get automations from db and assert that parent data matches the newPlacements
    const lookupByEmail = sinon.stub(slack, 'lookupByEmail').resolves(slackMocks.slackUser);
    const invite = sinon.stub(slack, 'invite').resolves(slackMocks.inviteUser);
    const kick = sinon.stub(slack, 'kick').resolves(slackMocks.removeUser);
    const create = sinon.stub(slack, 'createChannel').resolves(slackMocks.createGroups);
    const info = sinon.stub(slack, 'channelInfo').resolves(slackMocks.groupInfo);
    const listChannels = sinon.stub(slack, 'listChannels').resolves(slackMocks.channelList);
    const listUsers = sinon.stub(slack, 'listUsers').resolves(slackMocks.userList);

    await redisdb.delete('andela-partners');
    await executejobs('onboarding');
    sinon.assert.called(ioDotEmit);
    sinon.assert.called(sendMail);

    ioDotEmit.restore();
    lookupByEmail.restore();
    invite.restore();
    kick.restore();
    create.restore();
    info.restore();
    listChannels.restore();
    listUsers.restore();
    sendMail.restore();
  }).timeout(30 * 1000);
});
