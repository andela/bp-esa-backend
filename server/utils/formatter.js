/**
 * @description Determines the overal status from individual status
 * @param {Array} automations Array of automations
 *
 * @returns {String} success/failure
 */
export function getOveralStatus(automations) {
  if (Array.isArray(automations) && automations.length) {
    if (automations.every(automation => automation.status === 'success')) {
      return 'success';
    }
    return 'failure';
  }
  return 'failure';
}

/**
 * @description Formats slack automations data
 * @param {Array} slackAutomations Array of slack automations
 *
 * @returns {Object} Formatted slack automation
 */
export function formatSlackAutomations(slackAutomations) {
  const automations = {};

  automations.status = getOveralStatus(slackAutomations);
  automations.slackActivities = slackAutomations.map((sa) => {
    const {
      status, statusMessage, type, channelId, slackUserId,
    } = sa;
    const activity = {
      channelId, type, status, slackUserId, statusMessage,
    };
    return activity;
  });

  return automations;
}

/**
 * @description Formats freckle automations data
 * @param {Array} freckleAutomations Array of freckle automations
 *
 * @returns {Object} Formatted freckle automation
 */
export function formatFreckleAutomations(freckleAutomations) {
  const automations = {};

  automations.status = getOveralStatus(freckleAutomations);
  automations.freckleActivities = freckleAutomations.map((fa) => {
    const {
      status, statusMessage, type, freckleUserId, projectId,
    } = fa;

    const activity = {
      status, statusMessage, type, freckleUserId, projectId,
    };
    return activity;
  });

  return automations;
}

/**
 * @description Formats email automations data
 * @param {Array} emailAutomations Array of email automations
 *
 * @returns {Object} Formatted email automation
 */
export function formatEmailAutomations(emailAutomations) {
  const automations = {};
  automations.status = getOveralStatus(emailAutomations);
  automations.emailActivities = emailAutomations.map((ea) => {
    const {
      status, statusMessage, emailTo, subject,
    } = ea;

    const activity = {
      status, statusMessage, emailTo, subject,
    };
    return activity;
  });

  return automations;
}

/**
 * @description Formats a single automation data payload received from database.
 * @param {Object} automation Single automation data returned from database
 *
 * @returns {Object} Formated automation to be returned by the API
 */
export function formatAutomation(automation) {
  const {
    id, fellowId, fellowName, partnerId, partnerName, type, createdAt, updatedAt,
  } = automation;

  const formattedAutomation = {
    id, fellowId, fellowName, partnerId, partnerName, type, createdAt, updatedAt,
  };

  formattedAutomation.slackAutomations = formatSlackAutomations(automation.slackAutomations);
  formattedAutomation.emailAutomations = formatEmailAutomations(automation.emailAutomations);
  formattedAutomation.freckleAutomations = formatFreckleAutomations(automation.freckleAutomations);

  return formattedAutomation;
}

/**
 * @description Formats automation payload received from database.
 * @param {Array} payload Automations data returned from database
 *
 * @returns {Array} Formated automation to be returned by the API
 */
export function formatAutomationResponse(payload) {
  return payload.map(automation => formatAutomation(automation));
}
