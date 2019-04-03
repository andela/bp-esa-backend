/* eslint-disable no-param-reassign */
import { sendDevOnboardingMail, sendSOPOnboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer onboarding on email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationId ID of the particular automation
 * @returns {void}
 */
const emailOnboarding = async (placement, automationId) => {
  executeEmailAutomation([sendDevOnboardingMail, sendSOPOnboardingMail], placement, automationId);
};

export default emailOnboarding;
