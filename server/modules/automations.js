import sequelize from 'sequelize';
import db from '../models';

const { Op } = sequelize;
const {
  SlackAutomation, EmailAutomation, FreckleAutomation, Partner,
} = db;

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
export const createOrUpdateSlackAutomation = automationDetails => SlackAutomation.upsertById(automationDetails);

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
export const createOrUpdateEmaillAutomation = automationDetails => EmailAutomation.upsertById(automationDetails);

/**
 * @func createOrUpdateFreckleAutomation
 * @desc create or update a freckleAutomation in the Database.
 *
 * @param {object} automationDetails Details about the freckle automation to be created
 * @param {string} automationDetails.automationId ID of the connected automation
 * @param {string} automationDetails.freckleUserId ID of freckle user
 * @param {string} automationDetails.projectId ID of project on freckle
 * @param {string} automationDetails.type Automation type: projectCreation || projectAssignment
 * @param {string} automationDetails.status Automation status: success || failure
 * @param {string} automationDetails.statusMessage Status message
 * @param {string} [automationDetails.id] ID of existing freckleAutomation.
 * For updating purpose alone.
 *
 * @returns {Promise} Promise that resolves to the created/updated freckleAutomation.
 */
export const createOrUpdateFreckleAutomation = automationDetails => FreckleAutomation.upsertById(automationDetails);

/**
 * @func creatOrUpdatePartnerRecord
 * @desc create or update a partner record in the database
 *
 * @param {object} partnerDetails The partner details
 * @param {string} partnerDetails.name Name of partner
 * @param {string} partnerDetails.partnerId Id of partner from allocaitons
 * @param {string} partnerDetails.freckleProjectId The partner freckle project ID
 * @param {object} partnerDetails.slackChannels The partner slack channels
 * @param {string} partnerDetails.slackChannels.internal The partner internal slack channel
 * @param {string} partnerDetails.slackChannels.general The partner general slack channel
 *
 * @returns {Promise} Promise that resolves to the created/updated partner record
 */
export const creatOrUpdatePartnerRecord = async (partnerDetails) => {
  const { partnerId } = partnerDetails;
  const existingRecord = await db.Partner.find({ where: { partnerId } });
  if (existingRecord) {
    return db.Partner.update(partnerDetails, { where: { partnerId } });
  }
  return db.Partner.create(partnerDetails);
};

/**
 * @func getPartnerRecord
 * @desc Get a partner record from the database
 *
 * @param {string} partnerId The id of the partner(from the placement data).
 * @returns {Promise} Promise that resolves to the found partner record.
 */
export const getPartnerRecord = partnerId => Partner.findOne({ where: { partnerId } });
