import db from '../models';

const { SlackAutomation, EmailAutomation, NokoAutomation } = db;

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
 * @return {Promise} Promise to return the created/updated slackAutomation.
 */
// eslint-disable-next-line max-len
export const createOrUpdateSlackAutomation = automationDetails => SlackAutomation.upsertById(automationDetails);

export const retryAutomations = async (database, automationDetails, automationEntity) => {
  const { automationId } = automationDetails;
  const automationValues = Object.values(automationDetails);
  if (automationValues.includes(null)) {
    return 'Missing fields. Update failed';
  }
  const existingRecord = await database.findOne({
    where: {
      automationId,
      status: automationEntity.status,
      type: automationEntity.type,
    },
  });
  try {
    return database.update(automationDetails, { where: { id: existingRecord.id } });
  } catch (err) { return err; }
};

/**
 * @func createOrUpdateEmailAutomation
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
 * @return {Promise} Promise to return the created/updated emailAutomation.
 */
// eslint-disable-next-line max-len
export const createOrUpdateEmailAutomation = automationDetails => EmailAutomation.upsertById(automationDetails);

/**
 * @func createOrUpdateNokoAutomation
 * @desc create or update a noko automation in the Database.
 *
 * @param {object} automationDetails Details about the noko automation to be created
 * @param {string} automationDetails.automationId ID of the connected automation
 * @param {string} automationDetails.nokoUserId ID of noko user
 * @param {string} automationDetails.projectId ID of project on noko
 * @param {string} automationDetails.type Automation type: projectCreation || projectAssignment
 * @param {string} automationDetails.status Automation status: success || failure
 * @param {string} automationDetails.statusMessage Status message
 * @param {string} [automationDetails.id] ID of existing nokoAutomation.
 * For updating purpose alone.
 *
 * @returns {Promise} Promise to return the created/updated nokoAutomation.
 */
// eslint-disable-next-line max-len
export const createOrUpdateNokoAutomation = automationDetails => NokoAutomation.upsertById(automationDetails);
