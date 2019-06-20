/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import db from '../models';

import { getOrCreateProject, assignProject } from '../modules/freckle/projects';
import { accessChannel } from '../modules/slack/slackIntegration';
import {
  sendDevOnboardingMail, sendSOPOnboardingMail, sendITOffboardingMail, sendSOPOffboardingMail,
} from '../modules/email/emailModule';
import { executeEmailAutomation } from './helpers';
import { findPartnerById } from '../modules/allocations';
import { retryAutomations } from '../modules/automations';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID, SLACK_RACK_CITY_CHANNEL_ID } = process.env;

const {
  SlackAutomation, FreckleAutomation,
} = db;

const retryAccessChannels = async (slackAutomation, status, existingPlacement, automationId, channelId, context) => {
  if (slackAutomation.status === status && slackAutomation.type === context) {
    const response = await accessChannel(existingPlacement.email, channelId, context);
    retryAutomations(SlackAutomation, { ...response, automationId }, slackAutomation);
  }
};

/**
   * @desc Gets freckle automation processes to be re-run for an on-boarding placement
   *
   * @param {array} freckleAutomations array of freckle processes
   * @param {number} automationId Id of the automation process
   * @returns {void}
   */
export const freckleAutomationsReruns = (freckleAutomations, automationId) => {
  freckleAutomations.forEach((freckleAutomation) => {
    const types = {
      projectCreation: (project) => {
        retryAutomations(
          FreckleAutomation,
          { ...project, automationId },
          freckleAutomation,
        );
      },
      projectAssignment: (project) => {
        assignProject(freckleAutomation.email, project.id).then((result) => {
          retryAutomations(
            FreckleAutomation,
            { ...result, automationId },
            freckleAutomation,
          );
        });
      },
    };
    if (freckleAutomation.status === 'failure') {
      getOrCreateProject(freckleAutomation.partnerName).then(types[freckleAutomation.type]);
    }
  });
};

/**
   * @desc Gets email automation processes to be re-run for an on-boarding placement
   *
   * @param {Array} automationId Id of the automation process
   * @param {Array} emailAutomations array of freckle processes
   * @param {Object} existingPlacement object representing a placement
   * @returns {void}
   */
const emailAutomationReruns = ([recipent1, recipient2], emailAutomations, existingPlacement, automationId) => {
  if (!emailAutomations) {
    executeEmailAutomation([recipent1, recipient2], existingPlacement, automationId);
  }
};

/**
   * @desc Gets slack automation processes to be re-run for an on-boarding placement
   *
   * @param {Array} slackAutomations array of slack processes
   * @param {Object} existingPlacement object representing a placement
   * @param {Number} automationId Id of the automation process
   * @returns {void}
   */
const onboardingSlackAutomationsReruns = (slackAutomations, existingPlacement, automationId) => {
  slackAutomations.forEach(async (slackAutomation) => {
    retryAccessChannels(slackAutomation, 'failure', existingPlacement, automationId, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'kick');
    retryAccessChannels(slackAutomation, 'failure', existingPlacement, automationId, SLACK_RACK_CITY_CHANNEL_ID, 'invite');
  });
};

/**
   * @desc Gets slack automation processes to be re-run for an off-boarding placement
   *
   * @param {Array} slackAutomations array of slack processes
   * @param {Object} existingPlacement object representing a placement
   * @param {Number} automationId Id of the automation process
   * @returns {void}
   */
const offboardingSlackAutomationsReruns = (slackAutomations, existingPlacement, automationId) => {
  slackAutomations.forEach(async (slackAutomation) => {
    if (slackAutomation.status === 'failure' && slackAutomation.type === 'kick') {
      const { slackChannels } = await findPartnerById(existingPlacement.partnerId, 'offboarding');
      const response = await accessChannel(existingPlacement.email, slackChannels.general.channelId, 'kick');
      retryAutomations(SlackAutomation, { ...response, automationId }, slackAutomation);
    }
    retryAccessChannels(slackAutomation, 'failure', existingPlacement, automationId, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'invite');
  });
};

/**
   * @desc Gets automation processes to be re-run for an off-boarding placement
   *
   * @param {Array} freckleAutomations array of freckle processes
   * @param {Array} slackAutomations array of slack processes
   * @param {Array} emailAutomations array of email processes
   * @param {object} existingPlacement Details of the automation process
   * @param {number} automationId Id of the automation process
   * @returns {void}
   */
export const onboardingReRuns = (freckleAutomations, slackAutomations, emailAutomations, existingPlacement, automationId) => {
  freckleAutomationsReruns(freckleAutomations, automationId);
  onboardingSlackAutomationsReruns(slackAutomations, existingPlacement, automationId);
  emailAutomationReruns([sendDevOnboardingMail, sendSOPOnboardingMail], emailAutomations, existingPlacement, automationId);
};

/**
   * @desc Gets automation processes to be re-run for an off-boarding placement
   *
   * @param {Array} slackAutomations list of slack processes
   * @param {Array} emailAutomations list of email processes
   * @param {object} existingPlacement Details of the automation process
   * @param {number} automationId Id of the automation process
   * @returns {void}
   */
export const offboardingReRuns = (slackAutomations, emailAutomations, existingPlacement, automationId) => {
  offboardingSlackAutomationsReruns(slackAutomations, existingPlacement, automationId);
  emailAutomationReruns([sendSOPOffboardingMail, sendITOffboardingMail], emailAutomations, existingPlacement, automationId);
};
