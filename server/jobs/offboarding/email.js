/* eslint-disable no-param-reassign */
import { sendITOffboardingMail, sendSOPOffboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer offboarding via email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
export default function emailOffboarding(placement) {
  executeEmailAutomation([sendSOPOffboardingMail, sendITOffboardingMail], placement);
}
