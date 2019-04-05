import sinon from 'sinon';
import executejobs from '../../server/jobs';
import { io } from '../../server';

const fakeIoEmit = sinon.spy(io, 'emit');

describe('Jobs Execution Test Suite', async () => {
  it('should execute onboarding jobs successfully', async () => {
    this.timeout(20 * 1000);
    // get automations from db and test that parent data matches the newPlacements
    await executejobs('onboarding');
    sinon.assert.called(fakeIoEmit);
    fakeIoEmit.restore();
  });
});
