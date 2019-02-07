import sinon from 'sinon';
import axios from 'axios';
import ms from 'ms';
import client from '../../server/helpers/redis';
import * as resource from '../../server/modules/allocations';
import onboardingAllocations from '../mocks/allocations';
import { stringifiedPartners, samplePartner } from '../mocks/partners';

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
    const fakeClientGet = sinon
      .stub(client, 'get')
      .callsFake((value, cb) => cb.apply(this, [null, stringifiedPartners]));

    const partner = await resource.findPartnerById('ABCDEFZYXWVU');
    expect(partner.id).to.equal('ABCDEFZYXWVU');

    fakeClientGet.restore();
  });
  it('Should throw error if radis encounters error getting partner data', async () => {
    const errorMessage = 'Error retrieving data from radis';
    const fakeClientGet = sinon
      .stub(client, 'get')
      .callsFake((value, cb) => cb.apply(this, [new Error(errorMessage), null]));

    try {
      await resource.findPartnerById('ABCDEFZYXWVU');
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }
    fakeClientGet.restore();
  });
  it('Should throw an error when no partner record was found', async () => {
    // Mock successful request
    const fakeAxiosGet = sinon.stub(axios, 'get').callsFake(
      () => new Promise((resolve) => {
        resolve(samplePartner);
      }),
    );
    const fakeClientGet = sinon
      .stub(client, 'get')
      .callsFake((value, cb) => cb.apply(this, [null, stringifiedPartners]));
    const fakeClientSet = sinon.stub(client, 'set').callsFake(() => undefined);
    const errorMessage = 'Partner record was not found';

    try {
      await resource.findPartnerById('not-found-id');
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }

    fakeAxiosGet.restore();
    fakeClientGet.restore();
    fakeClientSet.restore();
  });
});
