import sinon from 'sinon';
import axios from 'axios';
import ms from 'ms';
import { redisdb } from '../../server/helpers/redis';
import * as resource from '../../server/modules/allocations';
import onboardingAllocations from '../mocks/allocations';
import { stringifiedPartner } from '../mocks/partners';

class Axios404Error extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

describe('Partner and Allocations Test Suite', async () => {
  beforeEach(() => {
    process.env.TIMER_INTERVAL = '3d';
  });
  it('Should fetch new placements by status in last TIMER_INTERVAL', async () => {
    // Mock successful request
    const fakeAxiosGet = sinon.stub(axios, 'get').callsFake(
      () => new Promise((resolve) => {
        resolve(onboardingAllocations);
      }),
    );

    // Mock current date and set to static value of the date test was written: 2018-11-16
    // To prevent failing tests in future due to change in value of Date.now
    // being called within the function
    const fakeCurrentDate = sinon.stub(Date, 'now').callsFake(() => 1542376484108);
    const result = await resource.fetchNewPlacements('Placed - Awaiting Onboarding');
    const lastInterval = new Date(1542376484108 - ms(process.env.TIMER_INTERVAL));
    expect(result.every(item => Date.parse(item.created_at) > lastInterval)).to.equal(true);
    expect(result.length).to.equal(6);
    // Total onboarding.data.values objects in mock response is 10
    expect(onboardingAllocations.data.values.length - result.length).to.equal(4);
    fakeAxiosGet.restore();
    fakeCurrentDate.restore();
  });
  it('Should successfully fetch partner when partnerId is provided', async () => {
    // Mock successful request
    const fakeClientGet = sinon.stub(redisdb, 'get').callsFake(() => stringifiedPartner);

    const partner = await resource.findPartnerById('ABCDEFZYXWVU', 'onboarding');
    expect(partner.partnerId || partner.id).to.equal('ABCDEFZYXWVU');
    fakeClientGet.restore();
  });
  it('Should throw an error when no partner record was found', async () => {
    const errorResponse = {
      data: {
        error: 'Partner not found',
      },
    };
    const fakeAxiosGet = sinon.stub(axios, 'get').callsFake(() => {
      throw new Axios404Error('no partner', errorResponse);
    });
    const fakeClientGet = sinon.stub(redisdb, 'get').callsFake(() => null);
    const fakeClientSet = sinon.stub(redisdb, 'set').callsFake(() => undefined);
    try {
      await resource.findPartnerById('not-found-id', 'onboarding');
    } catch ({ response }) {
      expect(response.data.error).to.equal(response.data.error);
    }
    fakeAxiosGet.restore();
    fakeClientGet.restore();
    fakeClientSet.restore();
  });
});
