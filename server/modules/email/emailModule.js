/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import emailTransport from './emailTransport';
import { getAppRoot, getTemplatesPath } from '../../utils/helpers';

dotenv.config();

const user = process.env.EMAIL_USER;
const opsEmail = process.env.OPS_EMAIL;
const itEmail = process.env.IT_EMAIL;
const supportEmail = process.env.SUPPORT_EMAIL;

const getEmailTemplatePath = emailTemplate => path.join(getTemplatesPath(), `email/${emailTemplate}`);
const developerOnboardingTemplatePath = getEmailTemplatePath('developer-onboarding-email.html');
const successOnboardingTemplatePath = getEmailTemplatePath('success-onboarding-email.html');
const itOffboardingPath = getEmailTemplatePath('it-offboarding-email.html');
const successOffboardingTemplatePath = getEmailTemplatePath('success-offboarding-email.html');
const placementFailedTemplatePath = getEmailTemplatePath('placement-fail-email.html');

/**
 * @func sendAndSaveMail
 * @desc Send an email then save details about the email as emailAutomation in the DB.
 *
 * @param {object} mailOptions The mail options.
 * @returns {undefined}
 */
const sendEmail = async (mailOptions) => {
  const data = {
    body: mailOptions.html,
    recipient: mailOptions.to,
    sender: mailOptions.from,
    subject: mailOptions.subject,
    status: 'success',
    statusMessage: 'Email sent succesfully',
  };
  try {
    await emailTransport.sendMail(mailOptions);
    return data;
  } catch (error) {
    data.status = 'failure';
    data.statusMessage = error.message;
    return data;
  }
};

/**
 * @func constructMailOptions
 * @desc An helper to help construct the mail options to be passed to the mail transport.
 *
 * @param {object} options The options to be added to the default options.
 * @param {string} options.htmlString The email in HTML format
 * @param {string} options.sendTo The email address of the recipient
 * @param {string} options.emailSubject The subject of the email
 *
 * @returns {object} The mail options
 */
const constructMailOptions = ({ emailBody, sendTo, emailSubject }) => ({
  from: user,
  to: sendTo,
  subject: emailSubject,
  generateTextFromHTML: true,
  html: emailBody,
});

/**
 * @desc A function to help send automation email using designed template
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} recipient Email of the recipient
 * @param {string} subject Subject of the email to be sent
 * @param {string} template Template to be used to send email
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
const sendMailWithTemplate = async (mailInfo, recipient, subject, template) => {
  const {
    developerName,
    developerEmail,
    developerLocation,
    partnerName,
    partnerLocation,
    startDate,
    rollOffDate,
  } = mailInfo;

  const mailOptions = constructMailOptions({
    sendTo: recipient,
    emailSubject: subject,
    emailBody: eval(`\`${fs.readFileSync(template).toString()}\``),
  });
  return sendEmail(mailOptions);
};

/**
 * @function sendDevOnboardingMail
 * @desc A function to help send email to a developer about an onboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} mailInfo.developerEmail Email of the developer onboarded
 * @param {string} mailInfo.partnerName Name of the partner
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
export const sendDevOnboardingMail = async (mailInfo) => {
  const subject = `${mailInfo.partnerName} Engagement Support`;
  const template = developerOnboardingTemplatePath;
  return sendMailWithTemplate(mailInfo, mailInfo.developerEmail, subject, template);
};

/**
 * @function sendITOffboardingMail
 * @desc A function to help send email to IT about an offboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} mailInfo.developerName Name of the developer offboarded
 * @param {string} mailInfo.developerLocation Location of developer offboarded
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
export const sendITOffboardingMail = async (mailInfo) => {
  const subject = `${mailInfo.developerName} Engagement Roll Off (${mailInfo.developerLocation})`;
  return sendMailWithTemplate(mailInfo, itEmail, subject, itOffboardingPath);
};

/**
 * @function sendSOPOnboardingMail
 * @desc A function to help send email to success-ops about an onboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} template The template to use in sending mail
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
const sendSOPEMail = async (mailInfo, template) => {
  const { developerName, partnerName } = mailInfo;
  const subject = `${developerName} Placed with ${partnerName}`;
  return sendMailWithTemplate(mailInfo, opsEmail, subject, template);
};

/**
 * @function sendSOPOnboardingMail
 * @desc A function to help send email to success-ops about an onboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
// eslint-disable-next-line max-len
export const sendSOPOnboardingMail = mailInfo => sendSOPEMail(mailInfo, successOnboardingTemplatePath);

/**
 * @function sendSOPOnboardingMail
 * @desc A function to help send email to success-ops about an offboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
// eslint-disable-next-line max-len
export const sendSOPOffboardingMail = mailInfo => sendSOPEMail(mailInfo, successOffboardingTemplatePath);

/**
 * @function sendPlacementFetchAlertEmail
 * @desc Send email to ESA if fetching placements fails constantly
 * @returns {Object} Fail status if the operation fails
 */
export const sendPlacementFetchAlertEmail = async () => {
  try {
    const mailOptions = constructMailOptions({
      sendTo: supportEmail,
      emailSubject: 'Allocations placement data error',
      emailBody: eval(`\`${fs.readFileSync(placementFailedTemplatePath).toString()}\``),
    });
    await emailTransport.sendMail(mailOptions);
    return { status: 'success', message: `Successfully sent email to ${supportEmail} ` };
  } catch ({ message }) {
    return { status: 'failure', message };
  }
};

export default constructMailOptions;
