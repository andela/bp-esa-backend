import moment from 'moment';

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
 * resolve the query counters
 *
 * @param {object} queryCount - results of a raw sqlQuery
 *
 * @returns {number} - resolved value of the count query
 */
const queryCountResolver = queryCount => queryCount[0].count;

/**
 * controller for the 'api/v1/automation/stats' endpoint that aggregate the automation stats
 *
 * @param {object} req - REST request object
 * @param {object} res - REST response object
 *
 * @returns {object} response reporting automation stats
 */
export default async (req, res) => {
  const date = req.query.date
    ? moment(req.query.date).format('YYYY-MM-DD')
    : moment().format('YYYY-MM-DD');

  const querySettings = {
    replacements: [`${date} 00:00:00.00`, `${date} 23:59:59.99`],
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
    const totalFreckleAutomations = queryCountResolver(
      await models.sequelize.query(totalFreckleAutomationsQuery, querySettings),
    );
    const successFreckleAutomations = queryCountResolver(
      await models.sequelize.query(successFreckleAutomationsQuery, querySettings),
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
    return res.status(400).json({ error });
  }
};
