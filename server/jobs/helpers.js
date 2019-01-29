import fs from 'fs';
import path from 'path';
/* eslint-disable import/prefer-default-export */

import { findPartnerById } from '../modules/allocations';
import emailTransport from '../modules/email/emailTransport';
import constructMailOptions from '../modules/email/emailModule';

const getEmailTemplate = emailTemplate => path.join(__dirname, `../modules/email/emailTemplates/${emailTemplate}`);
const placementFilTemplate = getEmailTemplate('placement-fail-email.html');
const receiverEmail = process.env.SUPPORT_EMAIL;
let number = 1;

/**
 * @desc Retrieves necessary info. to be sent via email for any given placement
 *
 * @param {oject} placement A placement instance from allocation
 *
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


const increaseFailCount = () => {
  // eslint-disable-next-line radix
  number += 1;
};

/**
 * @function sendPlacementFetchEmail
 * @desc Send email to ESA if fetching placements fails constantly
 * @param {string} receiver Info about the mail to be sent
 *
 * @returns {Object} Fail status if the operation fails
 */

const sendPlacementFetchEmail = (receiver) => {
  try {
    const mailOptions = constructMailOptions({
      sendTo: receiver,
      emailSubject: 'Allocations placement data error',
      // eslint-disable-next-line no-eval
      emailBody: eval(`\`${fs.readFileSync(placementFilTemplate).toString()}\``),
    });
    emailTransport.sendMail(mailOptions);
  } catch (error) {
    return { status: 'fail', message: error };
  }
};

const checkFailureCount = () => {
  // eslint-disable-next-line radix
  if (number >= parseInt(process.env.RESTART_TIME)) {
    sendPlacementFetchEmail(receiverEmail);
  }
};

export default { checkFailureCount, increaseFailCount };
