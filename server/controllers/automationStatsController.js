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
  totalNokoAutomationsQuery,
  successNokoAutomationsQuery,
  totalEmailAutomationsQuery,
  successEmailAutomationsQuery,
} from '../utils/rawSQLQueries';

import { validateDate, checkDuration } from '../helpers/dateHelpers';
/**
 * resolve the query counters
 *
 * @param {object} queryCount - results of a raw sqlQuery
 *
 * @returns {number} - resolved value of the count query
 */
const queryCountResolver = queryCount => Number(queryCount[0].count);

/**
 * controller for the 'api/v1/automation/stats' endpoint that aggregate the automation stats
 *
 * @param {object} req - REST request object
 * @param {object} res - REST response object
 *
 * @returns {object} response reporting automation stats
 */

export default async (req, res) => {
  const { duration, date } = req.query;
  const durationQueryError = checkDuration(duration);
  if (durationQueryError) {
    return res.status(400).json({ error: durationQueryError });
  }
  const dateDurations = validateDate(date, false, duration);

  const querySettings = {
    replacements: [`${dateDurations.dateStart} 00:00:00.00`, `${dateDurations.dateEnd} 23:59:59.99`],
    type: models.sequelize.QueryTypes.SELECT,
  };
  try {
    const totalAutomations = queryCountResolver(
      await models.sequelize.query(totalAutomationsQuery, querySettings),
    );
    const successAutomations = queryCountResolver(
      await models.sequelize.query(totalSuccessAutomationQuery, querySettings),
    );
    const totalOnboardingAutomations = queryCountResolver(
      await models.sequelize.query(totalOnboardingAutomationsQuery, querySettings),
    );
    const successOnboardingAutomations = queryCountResolver(
      await models.sequelize.query(successOnboardingAutomationsQuery, querySettings),
    );
    const totalOffboardingAutomations = queryCountResolver(
      await models.sequelize.query(totalOffboardingAutomationsQuery, querySettings),
    );
    const successOffboardingAutomations = queryCountResolver(
      await models.sequelize.query(successOffboardingAutomationsQuery, querySettings),
    );
    const totalSlackAutomations = queryCountResolver(
      await models.sequelize.query(totalSlackAutomationsQuery, querySettings),
    );
    const successSlackAutomations = queryCountResolver(
      await models.sequelize.query(successSlackAutomationsQuery, querySettings),
    );
    const totalNokoAutomations = queryCountResolver(
      await models.sequelize.query(totalNokoAutomationsQuery, querySettings),
    );
    const successNokoAutomations = queryCountResolver(
      await models.sequelize.query(successNokoAutomationsQuery, querySettings),
    );
    const totalEmailAutomations = queryCountResolver(
      await models.sequelize.query(totalEmailAutomationsQuery, querySettings),
    );
    const successEmailAutomations = queryCountResolver(
      await models.sequelize.query(successEmailAutomationsQuery, querySettings),
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
      noko: {
        total: totalNokoAutomations,
        success: successNokoAutomations,
      },
      email: {
        total: totalEmailAutomations,
        success: successEmailAutomations,
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
