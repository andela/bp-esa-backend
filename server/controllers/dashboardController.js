/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import Op from 'sequelize';
import models from '../models';
import paginationMeta from '../helpers/paginationHelper';
import { paginationResponse, response } from '../utils/formatter';
import { upsellingPartnerQuery, partnerStatsQuery } from '../utils/sequelizeFunctions/dashboardQuery';
import {
  isValidDateFormat, isValidStartDate, validateDate, checkDuration,
} from '../helpers/dateHelpers';

const automation = models.Automation;

const checkDateFormat = (req) => {
  const { date = {} } = req.query;
  if (!isValidDateFormat(date.startDate, date.endDate)) {
    throw new Error('Invalid date format provided please provide date in iso 8601 string');
  }
};
/**
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const upsellingPartnerPaginatedData = async (req, res) => {
  const type = 'onboarding';
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = limit * (page - 1);

  const { date = {} } = req.query;

  const { dateFrom, dateTo } = isValidStartDate(date);

  const allData = await upsellingPartnerQuery(type, offset, limit, dateFrom, dateTo);
  const data = { count: allData.count.length };
  const { numberOfPages, nextPage, prevPage } = paginationMeta(page, data.count, limit);
  return paginationResponse(res, allData.rows, page, numberOfPages, data, nextPage, prevPage, true);
};

/**
 * @desc Returns count and value in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const PartnerStats = async (req, res) => {
  const { date = {} } = req.query;

  const { dateFrom, dateTo } = isValidStartDate(date);
  const allData = await partnerStatsQuery(dateFrom, dateTo);
  return response(res, allData);
};

// const responseData = async (req, res, val) => {
//   const obj = { upSelling: upsellingPartnerPaginatedData, partnerStats: PartnerStats };
//   const { date = {} } = req.query;

//   throw !isValidDateFormat(date.startDate, date.endDate) ? new Error('Invalid date format provided please provide date in iso 8601 string') : await obj[val](req, res);
// };

export default class DashboardController {
  /**
   * @desc Gets onboarding partner results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and dashboard data
   */

  static async getUpsellingPartners(req, res) {
    try {
      checkDateFormat(req);
      return await upsellingPartnerPaginatedData(req, res);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @desc Gets partner statistics results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and dashboard data
   */

  static async getPartnerStats(req, res) {
    try {
      const { date = {} } = req.query;

      if (!isValidDateFormat(date.startDate, date.endDate)) {
        throw new Error('Invalid date format provided please provide date in iso 8601 string');
      }
      return await PartnerStats(req, res);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }


  /**
 * controller for the 'api/v1/dashboard/trends' endpoint that displays the trend
 *
 * @param {object} req - REST request object
 * @param {object} res - REST response object
 *
 * @returns {object} response reporting the trend
 */
  static async getEngagementTends(req, res) {
    const { duration, date } = req.query;
    const durationQueryError = checkDuration(duration);
    if (durationQueryError) {
      return res.status(400).json({ error: durationQueryError });
    }
    const dateDurations = validateDate(date, true, duration);
    try {
      const data = await automation.findAll({
        attributes: ['type', [models.sequelize.literal('DATE("createdAt")'), 'date'],
          [models.sequelize.fn('count', models.sequelize.col('*')), 'number'],
        ],
        where: {
          createdAt: {
            [Op.between]: [`${dateDurations.dateStart} 00:00:00.00`, `${dateDurations.dateEnd} 23:59:59.99`],
          },
        },
        order: [[models.sequelize.literal('DATE("createdAt")'), 'DESC']],
        group: ['automation.type', 'date'],
      });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(400).json({ err });
    }
  }
}
