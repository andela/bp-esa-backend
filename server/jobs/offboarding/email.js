/* eslint-disable no-param-reassign */
import { sendITOffboardingMail, sendSOPOffboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer offboarding via email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationId ID of the particular automation
 * @returns {void}
 */
export default function emailOffboarding(placement, automationId) {
  executeEmailAutomation([sendSOPOffboardingMail, sendITOffboardingMail], placement, automationId);
}
