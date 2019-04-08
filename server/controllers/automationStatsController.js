import models from '../models';

import {
  totalAutomationsQuery,
  totalSuccessAutomationQuery,
  totalOnboardingAutomationsQuery,
  successOnboardingAutomationsQuery,
  totalOffboardingAutomationsQuery,
  successOffboardingAutomationsQuery,
  totalSlackAutomationsQuery,
  successSlackAutomationsQuery,
  totalFreckleAutomationsQuery,
  successFreckleAutomationsQuery,
  totalEmailAutomationsQuery,
  successEmailAutomationsQuery,
} from '../utils/rawSQLQueries';

/**
 * @param {object} queryCount - results of a raw sqlQuery
 *
 * @returns {number} - resolved value of the count query
 */
const queryCountResolver = queryCount => queryCount.shift()[0].count;

export default async (req, res) => {
  try {
    const totalAutomations = queryCountResolver(
      await models.sequelize.query(totalAutomationsQuery),
    );
    const successAutomations = queryCountResolver(
      await models.sequelize.query(totalSuccessAutomationQuery),
    );
    const totalOnboardingAutomations = queryCountResolver(
      await models.sequelize.query(totalOnboardingAutomationsQuery),
    );
    const successOnboardingAutomations = queryCountResolver(
      await models.sequelize.query(successOnboardingAutomationsQuery),
    );
    const totalOffboardingAutomations = queryCountResolver(
      await models.sequelize.query(totalOffboardingAutomationsQuery),
    );
    const successOffboardingAutomations = queryCountResolver(
      await models.sequelize.query(successOffboardingAutomationsQuery),
    );
    const totalSlackAutomations = queryCountResolver(
      await models.sequelize.query(totalSlackAutomationsQuery),
    );
    const successSlackAutomations = queryCountResolver(
      await models.sequelize.query(successSlackAutomationsQuery),
    );
    const totalFreckleAutomations = queryCountResolver(
      await models.sequelize.query(totalFreckleAutomationsQuery),
    );
    const successFreckleAutomations = queryCountResolver(
      await models.sequelize.query(successFreckleAutomationsQuery),
    );
    const totalEmailAutomations = queryCountResolver(
      await models.sequelize.query(totalEmailAutomationsQuery),
    );
    const successEmailAutomations = queryCountResolver(
      await models.sequelize.query(successEmailAutomationsQuery),
    );

    const response = {
      automation: {
        total: totalAutomations,
        success: successAutomations,
      },
      onboarding: {
        total: totalOnboardingAutomations,
        success: successOnboardingAutomations,
      },
      offboarding: {
        total: totalOffboardingAutomations,
        success: successOffboardingAutomations,
      },
      slack: {
        total: totalSlackAutomations,
        success: successSlackAutomations,
      },
      freckle: {
        total: totalFreckleAutomations,
        success: successFreckleAutomations,
      },
      email: {
        total: totalEmailAutomations,
        success: successEmailAutomations,
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
