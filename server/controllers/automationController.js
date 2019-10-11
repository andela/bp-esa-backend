/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import moment from 'moment';
import * as util from 'util';
import * as fs from 'fs';
import stringify from 'csv-stringify';
import models from '../models';
import { paginationResponse, formatAutomationResponse } from '../utils/formatter';
import paginationMeta from '../helpers/paginationHelper';
import { sqlAutomationRawQuery, queryCounter } from '../utils/rawSQLQueries';
import { onboardingReRuns, offboardingReRuns } from '../jobs/reruns';
import { isValidDateFormat } from '../helpers/dateHelpers';

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
    model: models.NokoAutomation,
    as: 'nokoAutomations',
    required: false,
  },
];

const order = [
  ['id', 'DESC'],
];

let newData = [];


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
      id: automationIds.map($da => $da.id),
    },
  });
  return allData;
}

/**
 * Get search query
 *
 * @param   {object}  req  request object
 *
 * @return  {string}       sql query for search
 */
function addSearchQuery({ searchTerm, searchBy }) {
  if (!searchTerm) {
    return '';
  }
  switch (searchBy) {
    case 'partner':
      return util.format(' AND "a"."partnerName" ILIKE \'%%%s%%\' ', searchTerm);
    case 'fellow':
      return util.format(' AND "a"."fellowName" ILIKE \'%%%s%%\' ', searchTerm);
    default:
      return util.format(`
          AND (
            "a"."partnerName" ILIKE '%%%s%%' OR
            "a"."fellowName" ILIKE '%%%s%%'
          )

          `, searchTerm, searchTerm);
  }
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
 * @param {string} nokoAutomation - noko query string
 * @param {string} type - noko query string
 * @param {string} search - search query string
 * @returns {object} queries
 */
const filterQuery = (dateQuery, slackAutomation, emailAutomation, nokoAutomation, type, search) => {
  let myQueryCounter = queryCounter + addSearchQuery(search);
  let automationRawQuery = sqlAutomationRawQuery + addSearchQuery(search);
  if (slackAutomation) {
    automationRawQuery += 'AND "s"."status" = 0 ';
    myQueryCounter += 'AND "s"."status" = 0 ';
  }
  if (emailAutomation) {
    automationRawQuery += 'AND "e"."status" = 0 ';
    myQueryCounter += 'AND "e"."status" = 0 ';
  }
  if (nokoAutomation) {
    automationRawQuery += 'AND "f"."status" = 0 ';
    myQueryCounter += 'AND "f"."status" = 0 ';
  }
  if (dateQuery.length > 0) {
    automationRawQuery += `AND to_char("a"."createdAt", 'YYYY-MM-DD') ${dateQuery}`;
    myQueryCounter += `AND to_char("a"."createdAt", 'YYYY-MM-DD') ${dateQuery}`;
  }
  if (type && type.length > 0) {
    automationRawQuery += `AND "a"."type"='${type}'`;
    myQueryCounter += `AND "a"."type"='${util.format('%s', type)}'`;
  }
  return { myQueryCounter, automationRawQuery };
};


/**
 * Returns paginated data in JSON format
 *
 * @param {*} date The range to query
 * @param {*} slackAutomation Whether or not to query based on slack status
 * @param {*} emailAutomation Whether or not to query based on email status
 * @param {*} nokoAutomation Whether or not to query based on noko status
 * @param {*} type Whether or not to query based on automation type
 * @param {*} searchBy The field to search by
 * @param {*} searchTerm The search term to use to search the specified searchBy field
 * @param {*} page The page of the data to be returned
 * @param {*} limit The size of data to be returned in a page
 * @returns {object} JSON object with paginated data
 */
const paginationData = async (date, slackAutomation, emailAutomation, nokoAutomation, type, searchBy, searchTerm, page, limit) => {
  const orderBy = order.map(item => item.join(' ')).join();
  limit = parseInt(limit, 10) || 10;
  const querySettings = {
    replacements: [
      slackAutomation || 'success', emailAutomation || 'success', nokoAutomation || 'success',
    ],
    type: models.sequelize.QueryTypes.SELECT,
  };
  const { dateQuery: myDateQuery } = dateQueryFunc(date);
  // eslint-disable-next-line prefer-const
  let { automationRawQuery, myQueryCounter } = filterQuery(myDateQuery, slackAutomation, emailAutomation, nokoAutomation, type, { searchTerm, searchBy });
  const countData = await models.sequelize.query(myQueryCounter, { ...querySettings });
  const data = countData.shift();
  if (limit === -1) {
    limit = data.count;
  }
  page = parseInt(page, 10) || 1;
  const offset = limit * (page - 1);

  const { numberOfPages, nextPage, prevPage } = paginationMeta(page, data.count, limit);
  automationRawQuery += ` ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
  newData = await getAutomationDataFromIds(automationRawQuery, { ...querySettings }, { include, order });
  return paginationResponse(newData, page, numberOfPages, data, nextPage, prevPage);
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
      const {
        date = {},
        slackAutomation,
        emailAutomation,
        nokoAutomation,
        type = null,
        searchBy,
        searchTerm,
        page,
        limit,
      } = req.query;

      if (!isValidDateFormat(date.to, date.from)) {
        throw new Error('Invalid date format provided please provide date in iso 8601 string');
      }

      let response;
      await paginationData(date, slackAutomation, emailAutomation, nokoAutomation, type, searchBy, searchTerm, page, limit)
        .then((data) => {
          response = data;
        })
        .catch(error => res.status(500).json({ error: error.message }));
      return res.json(response);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @desc Gets automation results from db after a retry
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and automation data
   */
  static async retryAutomations(req, res) {
    try {
      const automationId = req.params.id;

      const existingPlacement = await automation.findByPk(automationId, { include });
      const {
        nokoAutomations, slackAutomations, emailAutomations, type,
      } = existingPlacement;

      if (type === 'onboarding') {
        onboardingReRuns(nokoAutomations, slackAutomations,
          emailAutomations, existingPlacement, automationId);
      }
      if (type === 'offboarding') {
        offboardingReRuns(slackAutomations,
          emailAutomations, existingPlacement, automationId);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Successfully fetched individual automation',
        data: formatAutomationResponse([existingPlacement]),
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  /**
   * @desc Returns JSON data from the frontend and converts it to a csv
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and generated report
   */
  // eslint-disable-next-line consistent-return
  static async postReport(req, res) {
    try {
      const {
        date = {},
        slackAutomation,
        emailAutomation,
        nokoAutomation,
        type = null,
        searchBy,
        searchTerm,
        page,
        limit,
      } = req.query;

      let response;

      await paginationData(date, slackAutomation, emailAutomation, nokoAutomation, type, searchBy, searchTerm, page, limit)
        .then((data) => {
          response = data;
        })
        .catch(error => res.status(500).json(error));

      stringify(response.data, {
        header: true,
      }).pipe(res);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="download-${Date.now()}.csv"`);
      return res;
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * @desc Sends the csv file to the frontend and deletes the local copy of the csv
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and served report
   */

  static async getReport(req, res) {
    try {
      return res.status(200).sendFile(`${__dirname}/Reports.csv`, () => {
        fs.unlink(`${__dirname}/Reports.csv`, (err) => {
          if (err) {
            res.status(404).json({ error: 'The file was not found' });
          }
        });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
