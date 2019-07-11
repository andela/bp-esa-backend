import { onboardingReRuns, offboardingReRuns } from '../../server/jobs/reruns';
import {
  nokoAutomations, slackAutomations, emailAutomations, existingPlacement,
} from '../mocks/retryautomations';


describe('Jobs Execution Reruns', async () => {
  it('should execute the onboarding reruns successfully', async () => {
    const result = onboardingReRuns(nokoAutomations, slackAutomations,
      emailAutomations, existingPlacement, existingPlacement.id);
    expect(result).to.equal(undefined);
  });
  it('should execute the offboarding reruns successfully', async () => {
    const response = offboardingReRuns(slackAutomations,
      emailAutomations, existingPlacement, existingPlacement.id);
    expect(response).to.equal(undefined);
  });
});
