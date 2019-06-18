import db from '../models';

const { SlackAutomation, EmailAutomation, FreckleAutomation } = db;

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
 * @returns {Promise} Promise to return the created/updated freckleAutomation.
 */
// eslint-disable-next-line max-len
export const createOrUpdateFreckleAutomation = automationDetails => FreckleAutomation.upsertById(automationDetails);
