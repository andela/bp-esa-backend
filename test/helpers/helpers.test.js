import sinon from 'sinon';
import response from '../../server/helpers/response';
import { getMailInfo, checkFailureCount } from '../../server/jobs/helpers';
import { automationData } from '../../server/jobs';

import * as allocation from '../../server/modules/allocations';
import { samplePartner } from '../mocks/partners';
import placements from '../mocks/allocations';

const fakeFindPartner = sinon
  .stub(allocation, 'findPartnerById')
  .callsFake(() => samplePartner.data.values[0]);

describe('Test that helper functions work as expected', () => {
  it('Ensures that response object contains data field', () => {
    const data = { password: 'should be more than 6 chars' };
    const responseObject = response(true, 'something bad happened', data);
    expect(responseObject.data).to.equal(data);
  });
  it('Should return expected information about the partner', async () => {
    const placement = placements.data.values[0];
    const mailInfo = await getMailInfo(placement);
    expect(mailInfo).to.be.an('object');
    expect(mailInfo.developerName).to.equal(placement.fellow.name);
    expect(mailInfo.partnerName).to.equal(placement.client_name);
    expect(mailInfo.partnerLocation).to.equal(samplePartner.data.values[0].location);
    expect(mailInfo.startDate).to.equal(placement.start_date);
    fakeFindPartner.restore();
  });
  it('Should return expected automation data from placement details', async () => {
    const placement = placements.data.values[0];
    const data = automationData(placement, 'onboarding');
    expect(data).to.be.an('object');
    expect(data.fellowId).to.equal(placement.fellow.id);
    expect(data.partnerName).to.equal(placement.client_name);
    expect(data.placementId).to.equal(placement.id);
  });

  it('should return email sent message', async () => {
    const allocationsFetchFailCount = process.env.FETCH_FAIL_AUTOMATION_COUNT + 20;
    const sendResponse = await checkFailureCount(allocationsFetchFailCount);
    expect(sendResponse.message).to.equal('Email sent successfully');
  });
  it('should return Max failures not reached yet if fail count has', async () => {
    const allocationsFetchFailCount = process.env.FETCH_FAIL_AUTOMATION_COUNT - 5;
    const sendResponse = await checkFailureCount(allocationsFetchFailCount);
    expect(sendResponse.message).to.equal('Max failures not reached yet');
  });
});
