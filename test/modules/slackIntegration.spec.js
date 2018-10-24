import { createPartnerChannels } from '../../server/modules/slackIntegration';
import allocationsMocks from '../mocks/allocations';

describe('Slack Integration Test Suite', async () => {
  it('Should create slack channels for a new partner', async () => {
    const { partner } = allocationsMocks;
    const createResult = await createPartnerChannels(partner.id);
    const expectedResult = {
      partnerId: 'ABCDEFZYXWVU',
      generalChannel: {
        id: 'GDL7RDC5V',
        name: 'p-sample-partner',
      },
      internalChannel: {
        id: 'GEY7RDC5V',
        name: 'p-sample-partner-int',
      },
    };
    expect(createResult.generalChannel.id).to.equal(expectedResult.generalChannel.id);
    expect(createResult.internalChannel.id).to.equal(expectedResult.internalChannel.id);
  });
});
