/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import moment from 'moment';
import { Op } from 'sequelize';
import models from '../models';
import paginationMeta from '../helpers/paginationHelper';
import { paginationResponse } from '../utils/formatter';
import { isValidDateFormat, isValidStartDate } from '../helpers/dateHelpers';


const automation = models.Automation;

/**
 * Returns dateFunction
 * @param {string} type - boarding type
 * @param {number} offset - start value
 * @param {number} limit - number of records to pick
 * @param {string} dateFrom - start date
 * @param {string} dateTo - end date
 * @returns {object} - upselling partner record
 */
const UpsellingPartnerQuery = async (type, offset, limit, dateFrom, dateTo) => {
  const val = await automation
    .findAndCountAll({
      attributes: [
        [models.sequelize.fn('count', models.sequelize.col('*')), 'count'],
        'type',
        'partnerName',
      ],
      where: {
        createdAt: {
          [Op.gte]: moment(dateFrom).startOf('day'),
          [Op.lte]: moment(dateTo).endOf('day'),
        },
        type,
      },
      offset,
      limit,
      order: models.sequelize.literal('count DESC'),
      group: ['automation.type', 'automation.partnerName'],
      raw: true,
    });
  return val;
};

/**
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const paginationData = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = limit * (page - 1);

  const { date = {} } = req.query;

  const { dateFrom, dateTo } = isValidStartDate(date);

  const allData = await UpsellingPartnerQuery('onboarding', offset, limit, dateFrom, dateTo);
  const data = { count: allData.count.length };
  const { numberOfPages, nextPage, prevPage } = paginationMeta(page, data.count, limit);
  return paginationResponse(res, allData.rows, page, numberOfPages, data, nextPage, prevPage, true);
};

export default class DashboardController {
  /**
   * @desc Gets automation results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and dashboard data
   */

  static async getUpsellingPartners(req, res) {
    try {
      const { date = {} } = req.query;
      const errorMessage = 'Invalid date format provided please provide date in iso 8601 string';
      return !isValidDateFormat(date.endDate, date.startDate) ? new Error(errorMessage) : await paginationData(req, res);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
