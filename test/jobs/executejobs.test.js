import sinon from 'sinon';
import executejobs from '../../server/jobs';
import { io } from '../../server';
import { redisdb } from '../../server/helpers/redis';

const fakeIoEmit = sinon.spy(io, 'emit');

describe('Jobs Execution Test Suite', async () => {
  it('should execute onboarding jobs successfully', async () => {
    // get automations from db and assert that parent data matches the newPlacements
    await redisdb.delete('andela-partners');
    await executejobs('onboarding');
    sinon.assert.called(fakeIoEmit);
    fakeIoEmit.restore();
  }).timeout(30 * 1000);
});
