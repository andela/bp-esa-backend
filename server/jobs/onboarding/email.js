import { sendDevOnboardingMail, sendSOPOnboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer onboarding on email
 *
 * @param {Object} placement Placement record whose developer is to be offboarded
 * @param {Object} partner Partner details to be used in the automation
 * @param {Object} automationId ID of the particular automation
 * @returns {Promise} Promise to return the result of emailAutomation performed
 */
const emailOnboarding = async (placement, partner, automationId) => executeEmailAutomation(
  [sendDevOnboardingMail, sendSOPOnboardingMail],
  placement,
  partner.location,
  automationId,
);

export default emailOnboarding;
