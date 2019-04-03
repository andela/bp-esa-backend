/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import moment from 'moment';
import models from '../models';
import { paginationResponse } from '../utils/formatter';
import sqlAutomationRawQuery, { queryCounter } from '../utils/rawSQLQueries';

const automation = models.Automation;
export const include = [
  {
    model: models.EmailAutomation,
    as: 'emailAutomations',
    required: false,
  },
  {
    model: models.SlackAutomation,
    as: 'slackAutomations',
    required: false,
  },
  {
    model: models.FreckleAutomation,
    as: 'freckleAutomations',
    required: false,
  },
];

const order = [
  ['id', 'DESC'],
];


/**
 * Get Automation Model Objects from Raw Query
 *
 * @param   {string}  automationRawQuery  raw Sql string
 * @param   {object}  querySettings       query options
 * @param   {object}  options             sequelize model query options
 *
 * @return  {array}                       array of automation objects
 */
async function getAutomationDataFromIds(automationRawQuery, querySettings = {}, options = {}) {
  const automationIds = await models.sequelize.query(automationRawQuery, { ...querySettings }, options);
  const allData = await automation.findAll({
    ...options,
    where: {
      id: {
        $in: automationIds.map($da => $da.id),
      },
    },
  });
  return allData;
}

/**
 * Returns dateQuery
 * @param {string} date - date string
 * @returns {object} dateQuery
 */
const dateQueryFunc = (date = { to: new Date() }) => {
  // eslint-disable-next-line no-unused-vars
  const todaysDate = moment().format('YYYY-MM-DD');
  const dateTo = moment(date.to).format('YYYY-MM-DD');
  const dateFrom = date.from ? moment(date.from).format('YYYY-MM-DD') : null;

  // check if date.from is greater than date.to or today, return an error
  if ((dateFrom > dateTo) || (dateFrom > todaysDate)) {
    throw new Error('date[from] cannot be greater than date[now] or today');
  }

  // check if both date from and to are provided
  if (dateFrom && dateTo) {
    return { dateQuery: `BETWEEN '${dateFrom}' AND '${dateTo}' ` };
  }


  return { dateQuery: `<= '${dateTo}'` };
};

/**
 *  Returns query strings
 * @param {string} dateQuery - date query string
 * @param {string} slackAutomation - slack query string
 * @param {string} emailAutomation - email query string
 * @param {string} freckleAutomation - freckle query string
 * @returns {object} queries
 */
const filterQuery = (dateQuery, slackAutomation, emailAutomation, freckleAutomation) => {
  let myQueryCounter = queryCounter;
  let automationRawQuery = sqlAutomationRawQuery;

  if (slackAutomation) {
    automationRawQuery += 'AND "s"."status" = 0 ';
    myQueryCounter += 'AND "s"."status" = 0 ';
  }
  if (emailAutomation) {
    automationRawQuery += 'AND "e"."status" = 0 ';
    myQueryCounter += 'AND "e"."status" = 0 ';
  }
  if (freckleAutomation) {
    automationRawQuery += 'AND "f"."status" = 0 ';
    myQueryCounter += 'AND "f"."status" = 0 ';
  }
  if (dateQuery.length > 0) {
    automationRawQuery += `AND "a"."createdAt" ${dateQuery}`;
    myQueryCounter += `AND "a"."createdAt" ${dateQuery}`;
  }

  return { myQueryCounter, automationRawQuery };
};

/**
 * Get pagination meta
 *
 * @param   {number}  page current page
 * @param   {number}  count total data count
 * @param   {number}  limit total per page
 *
 * @return  {object} an object containing offset nextPage and prevPage properties
 */
function getPaginationMeta(page, count, limit) {
  let prevPage;
  let nextPage;
  const numberOfPages = Math.ceil(count / limit); // all pages count
  const offset = limit * (page - 1);
  // check if number of pages is less than the current page number to show next page number
  if (page < numberOfPages) {
    nextPage = page + 1;
  }
  // show previous page number if page is greater than 1
  if (page > 1) {
    prevPage = page - 1;
  }
  return {
    numberOfPages, offset, nextPage, prevPage,
  };
}

/**
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const paginationData = async (req, res) => {
  const orderBy = order.map(item => item.join(' ')).join();
  const limit = parseInt(req.query.limit, 10) || 10;
  const {
    date, slackAutomation, emailAutomation, freckleAutomation,
  } = req.query;
  const querySettings = {
    replacements: [
      slackAutomation || 'success',
      emailAutomation || 'success',
      freckleAutomation || 'success',
    ],
    type: models.sequelize.QueryTypes.SELECT,
  };
  const { dateQuery: myDateQuery } = dateQueryFunc(date);
  // eslint-disable-next-line prefer-const
  let { automationRawQuery, myQueryCounter } = filterQuery(myDateQuery, slackAutomation, emailAutomation, freckleAutomation);
  const countData = await models.sequelize.query(myQueryCounter, { ...querySettings });
  const data = countData.shift();
  const page = parseInt(req.query.page, 10) || 1;
  const {
    numberOfPages, offset, nextPage, prevPage,
  } = getPaginationMeta(page, data.count, limit);
  automationRawQuery += ` ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
  const allData = await getAutomationDataFromIds(automationRawQuery, { ...querySettings }, { include, order });
  return paginationResponse(res, allData, page, numberOfPages, data, nextPage, prevPage);
};

export default class AutomationController {
  /**
   * @desc Gets automation results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and automation data
   */

  static async getAutomations(req, res) {
    try {
      return await paginationData(req, res);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
