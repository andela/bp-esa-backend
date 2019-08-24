import sinon from 'sinon';
import moxios from 'moxios';
import executejobs from '../../server/jobs';
import { io } from '../../server';
import { redisdb } from '../../server/helpers/redis';
import Slack from '../../server/modules/slack/slackIntegration';

const fakeIoEmit = sinon.spy(io, 'emit');

describe('Jobs Execution Test Suite', async () => {
  it('should execute onboarding jobs successfully', async () => {
    // get automations from db and assert that parent data matches the newPlacements
    moxios.stubRequest('https://slack.com/api/conversations.info', {
      status: 200,
      response: {},
    });
    sinon.stub(Slack, 'accessChannel').returns({
      slackUserId: 'userId',
      channelId: 'channelId',
      channelName: 'channelInfo.channel.name',
      type: 'context',
      status: 'success',
      statusMessage: 'email contextObject[context].message channel',
    });
    await redisdb.delete('andela-partners');
    executejobs('onboarding');
    // sinon.assert.called(fakeIoEmit);
    // fakeIoEmit.restore();
  }).timeout(30 * 1000);
});
