/**
 * @description Determines the overal status from individual status
 * @param {Array} automations Array of automations
 *
 * @returns {String} success/failure
 */
export function getOveralStatus(automations) {
  return (
    Array.isArray(automations)
    && automations.length
    && automations.every(
      automation => automation.status === 'success',
    )
  ) ? 'success' : 'failure';
}

/**
 * @description Copy original object to another object with only provided parameters
 * @param {Object} srcObj Source/Original Object
 * @param {Array} props Array of parameters to be copied
 *
 * @returns {Object} Copy Object
 */
export function objectCopy(srcObj, props) {
  const copy = {};
  props.forEach((prop) => {
    if (prop in srcObj) {
      copy[prop] = srcObj[prop];
    }
  });
  return copy;
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
    const props = ['status', 'statusMessage', 'type', 'channelId', 'channelName', 'slackUserId'];
    return objectCopy(sa, props);
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
    const props = ['status', 'statusMessage', 'type', 'freckleUserId', 'projectId'];
    return objectCopy(fa, props);
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
    const props = ['status', 'statusMessage', 'emailTo', 'subject'];
    return objectCopy(ea, props);
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
  const props = ['id', 'fellowId', 'fellowName', 'partnerId', 'partnerName', 'type', 'createdAt', 'updatedAt'];
  const formattedAutomation = objectCopy(automation, props);

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
