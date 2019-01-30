/* eslint-disable no-param-reassign */
import { sendDevOnboardingMail, sendSOPOnboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer onboarding on email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
const emailOnboarding = async (placement) => {
  executeEmailAutomation([sendDevOnboardingMail, sendSOPOnboardingMail], placement);
};

export default emailOnboarding;
