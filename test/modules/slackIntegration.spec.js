import sinon from 'sinon';
import * as slack from '../../server/modules/slack/slackIntegration';
import { client } from '../../server/modules/allocations';
import { allocationsMocks, rawAllocations } from '../mocks/allocations';
import slackMocks from '../mocks/slack';

const fakeClientGet = sinon
  .stub(client, 'get')
  .callsFake((value, cb) => cb.apply(this, [null, rawAllocations]));

const fakeLookupByEmail = sinon
  .stub(slack.slackClient.users, 'lookupByEmail')
  .callsFake(() => slackMocks.slackUser);

const fakeInvite = sinon
  .stub(slack.slackClient.groups, 'invite')
  .callsFake(() => slackMocks.inviteUser);

const fakeKick = sinon
  .stub(slack.slackClient.groups, 'kick')
  .callsFake(() => slackMocks.removeUser);

describe('Slack Integration Test Suite', async () => {
  it('Should create internal slack channels for a new partner', async () => {
    const fakeCreate = sinon
      .stub(slack.slackClient.groups, 'create')
      .callsFake(() => slackMocks.createGroups.createInternal);
    const { partner } = allocationsMocks;
    const createResult = await slack.createPartnerChannels(partner.id);
    const expectedResult = {
      partnerId: 'ABCDEFZYXWVU',
      internalChannel: {
        id: 'GEY7RDC5V',
        name: 'p-sample-partner-int',
      },
    };
    expect(createResult.internalChannel.id).to.equal(expectedResult.internalChannel.id);
    fakeCreate.restore();
  });

  it('Should create general slack channels for a new partner', async () => {
    const fakeCreate = sinon
      .stub(slack.slackClient.groups, 'create')
      .callsFake(() => slackMocks.createGroups.createGeneral);
    const { partner } = allocationsMocks;
    const createResult = await slack.createPartnerChannels(partner.id);
    const expectedResult = {
      partnerId: 'ABCDEFZYXWVU',
      generalChannel: {
        id: 'GDL7RDC5V',
        name: 'p-sample-partner',
      },
    };
    expect(createResult.generalChannel.id).to.equal(expectedResult.generalChannel.id);
    fakeCreate.restore();
  });

  it('Should add developers to respective channels', async () => {
    const email = 'johndoe@mail.com';
    const channel = 'GDL7RDC5V';

    const inviteResult = await slack.addToChannel(email, channel);
    expect(inviteResult.message).to.equal('User added to channel successfully');
  });

  it('Should remove developers from channels', async () => {
    const email = 'johndoe@mail.com';
    const channel = 'GDL7RDC5V';

    const inviteResult = await slack.removeFromChannel(email, channel);
    expect(inviteResult.message).to.equal('User removed from channel successfully');
  });
});
