import sequelize from 'sequelize';
import db from '../../server/models';

const { Op } = sequelize;
const { SlackAutomation, EmailAutomation, Automation } = db;

/**
 * @func createOrUpdateSlackAutomation
 * @desc create or update a slackAutomation in the Database.
 *
 * @param {object} automationDetails Details about the slack automation to be created
 * @param {string} automationDetails.automationId ID of the connected automation
 * @param {string} automationDetails.channelId ID of a slack channel
 * @param {string} automationDetails.slackUserId ID of a slack user
 * @param {string} automationDetails.type Automation type: create || kick || invite
 * @param {string} automationDetails.status Automation status: success || failure
 * @param {string} automationDetails.statusMessage Status message
 * @param {string} [automationDetails.id] ID of existing slackAutomation.
 * For updating purpose alone.
 *
 * @return {Promise} Promise that resolves the created/updated slackAutomation.
 */
export const createOrUpdateSlackAutomation = automationDetails => (
  SlackAutomation.upsertById(automationDetails)
);

/**
 * @func getSlackAutomation
 * @desc Get an already created slackAutomation from the database.
 * Either the channelName or the slackAutomationId should be provided for this operation.
 *
 * @param {object} automationDetails Details about the slack automation to be fetched
 * @param {string} [automationDetails.channelName] Name of the created slack channel
 * @param {string} [automationDetails.slackAutomationId] ID of existing slackAutomation.
 *
 * @return {Promise} Promise that resolves the fetched slackAutomation.
 */
export const getSlackAutomation = (automationDetails) => {
  const { slackAutomationId, channelName } = automationDetails;
  return SlackAutomation.find({
    where: {
      [Op.or]: [{ id: slackAutomationId }, { channelName }],
    },
  });
};

/**
 * @func createOrUpdateEmaillAutomation
 * @desc create or update an emailAutomation in the Database.
 *
 * @param {object} automationDetails Details about the email automation to be created
 * @param {string} automationDetails.automationId ID of the connected automation
 * @param {string} automationDetails.body Body of the email
 * @param {string} automationDetails.recipient Recipient of the email
 * @param {string} automationDetails.sender Sender of the email
 * @param {string} automationDetails.subject Subject of the email
 * @param {string} automationDetails.status Automation status: success || failure
 * @param {string} automationDetails.statusMessage Status message
 * @param {string} [automationDetails.id] ID of existing emailAutomation.
 * For updating purpose alone.
 *
 * @return {Promise} Promise that resolves the created/updated emailAutomation.
 */
export const createOrUpdateEmaillAutomation = automationDetails => (
  EmailAutomation.upsertById(automationDetails)
);

/**
 * @func createAutomation
 * @desc create an automation in the database.
 *
 * @param {object} automationDetails Details about the automation to be created
 * @param {string} automationDetails.fellowName Name of fellow
 * @param {string} automationDetails.fellowId Id of fellow
 * @param {string} automationDetails.partnerName Name of partner
 * @param {string} automationDetails.partnerId Id of partner
 * @param {string} automationDetails.type Automation type: onboarding || offboarding
 *
 * @return {Promise} Promise that resolves the created automation.
 */
export const createAutomation = automationDetails => Automation.create(automationDetails);