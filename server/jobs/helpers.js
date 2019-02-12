import { findPartnerById } from '../modules/allocations';
import { sendPlacementFetchAlertEmail } from '../modules/email/emailModule';

export const FAILED_COUNT_NUMBER = 0;

/**
 * @desc Retrieves necessary info. to be sent via email for any given placement
 * @param {oject} placement A placement instance from allocation
 * @returns {object} Mail info to be sent
 */
export const getMailInfo = async (placement) => {
  const {
    fellow: { name: developerName, email: developerEmail, location: developerLocation },
    client_name: partnerName,
    client_id: partnerId,
    end_date: rollOffDate,
    start_date: dateStart,
  } = placement;
  const { location: partnerLocation } = await findPartnerById(partnerId);
  return {
    developerName,
    partnerName,
    developerEmail,
    developerLocation,
    partnerLocation,
    rollOffDate,
    startDate: dateStart === '' ? 'not specified' : dateStart,
  };
};

/**
 * @desc Checks fail count then calls method to send failure email
 * @param {string} failCount Info about the number of times fetching placements has failed
 * @returns {Object} message about email being sent
 */
export const checkFailureCount = async (failCount) => {
  if (failCount >= parseInt(process.env.FETCH_FAIL_AUTOMATION_COUNT, 10)) {
    await sendPlacementFetchAlertEmail();
    return { message: 'Email sent successfully' };
  }
  return { message: 'Max failures not reached yet' };
};

/**
 * @desc Executes email functions for an email automation
 *
 * @param {Array} emailFunctions List of functions to execute for the automation
 * @param {Object} placement Placement data with which to execute automation
 *
 * @returns {void}
 */
export async function executeEmailAutomation(emailFunctions, placement) {
  try {
    const mailInfo = await getMailInfo(placement);
    await Promise.all(emailFunctions.map(func => func(mailInfo)));
    // write automation success to database
  } catch (error) {
    // write automation failure to database
    console.log(error.message);
  }
}
