/* eslint-disable no-param-reassign */
import { sendDevOnboardingMail, sendSOPOnboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer onboarding on email
 *
 * @param {Object} placement Placement record whose developer is to be offboarded
 * @param {Object} automationId ID of the particular automation
 * @returns {Promise} Promise to return the result of emailAutomation performed
 */
const emailOnboarding = async (placement, automationId) => executeEmailAutomation([sendDevOnboardingMail, sendSOPOnboardingMail], placement, automationId);

export default emailOnboarding;
