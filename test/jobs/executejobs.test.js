import sinon from 'sinon';
import executejobs from '../../server/jobs';
import { io } from '../../server';
import { redisdb } from '../../server/helpers/redis';
import slackMocks from '../mocks/slack';
import { slack } from '../../server/modules/slack/slackIntegration';
import email from '../../server/modules/email/emailTransport';
import db from '../../server/models';
import { include } from '../../server/controllers/automationController';

const ioDotEmit = sinon.spy(io, 'emit');
const sendMail = sinon.spy(email, 'sendMail');

describe('Jobs Execution Test Suite', async () => {
  it('should execute onboarding jobs successfully', async () => {
    const data = {
      id: 762,
      placementId: '0b2f4b24-6529-48f5-9377-58749ba34234',
      fellowName: 'Porter, Cronin',
      fellowId: '928bee94-114f-4e41-b477-98d6bf2ffb91',
      email: 'esther.namusisi@andela.com',
      partnerName: 'ACCION MICROFINANCE BANK',
      partnerId: '-KhbZT8yDdech1RNDi14',
      type: 'onboarding',
      createdAt: '2019-09-10T17:46:26.590Z',
      updatedAt: '2019-09-10T17:46:26.590Z',
      emailAutomations: [],
      slackAutomations: [],
      nokoAutomations: [],
    };

    // get automations from db and assert that parent data matches the newPlacements
    const lookupByEmail = sinon.stub(slack, 'lookupByEmail').resolves(slackMocks.slackUser);
    const invite = sinon.stub(slack, 'invite').resolves(slackMocks.inviteUser);
    const kick = sinon.stub(slack, 'kick').resolves(slackMocks.removeUser);
    const create = sinon.stub(slack, 'createChannel').resolves(slackMocks.createGroups);
    const info = sinon.stub(slack, 'channelInfo').resolves(slackMocks.groupInfo);
    const listChannels = sinon.stub(slack, 'listChannels').resolves(slackMocks.channelList);
    const listUsers = sinon.stub(slack, 'listUsers').resolves(slackMocks.userList);
    sinon.stub(db.Automation, 'findByPk').resolves(data, { include });

    await redisdb.delete('andela-partners');
    await executejobs('onboarding');
    sinon.assert.calledWith(ioDotEmit, 'newAutomation');
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
