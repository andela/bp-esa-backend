/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import { Op } from 'sequelize';
import moment from 'moment';
import models from '../models';
import { formatAutomationResponse, paginationResponse } from '../utils/formatter';
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
 * Returns all data
 *
 * @param {object} res REST Response object
 * @returns {object} Response containing all data
 */
const checkQueryObject = res => (
  automation.findAll({ include, order }).then(data => res.status(200).json({
    status: 'success',
    message: 'Successfully fetched automations',
    data: formatAutomationResponse(data),
  }))
);


/**
 * Returns dateQuery
 * @param {string} dateQuery - date query
 * @param {string} date - date string
 * @param {object} res - response object
 * @returns {object} dateQuery
 */
const dateQueryFunc = (dateQuery, date, res) => {
  // eslint-disable-next-line no-unused-vars
  let createdAt;
  let dateTo;
  let dateFrom;
  const todaysDate = moment().format('YYYY-MM-DD');

  // check if date object exists in the req body
  if (date) {
    if (date.to) {
      dateTo = moment(date.to).format('YYYY-MM-DD');
    }
    if (date.from) {
      dateFrom = moment(date.from).format('YYYY-MM-DD');
    }

    // check if date.from is greater than date.to or today, return an error
    if ((dateFrom > dateTo) || (dateFrom > todaysDate)) {
      return res.status(400).json({ error: 'date[from] cannot be greater than date[now] or today' });
    }

    // check if both date from and to are provided
    if (dateFrom && dateTo) {
      dateQuery = `BETWEEN '${dateFrom}' AND '${dateTo}' `;
      createdAt = {
        [Op.between]: [dateFrom, dateTo],
      };
    }

    // if only the date from is provided then return data up to now
    if (dateFrom && !dateTo) {
      dateQuery = `BETWEEN '${dateFrom}' AND '${todaysDate}' `;
      createdAt = {
        [Op.between]: [dateFrom, todaysDate],
      };
    }

    // if only the date.to has been provided, return all data up to date.to
    if (!dateFrom && dateTo) {
      dateQuery = `<= '${dateTo}'`;
      createdAt = {
        [Op.lte]: dateTo,
      };
    }
  } else {
    // if date object is not provided return all data up to today
    dateQuery = `<= '${todaysDate}'`;
    (
      createdAt = {
        [Op.lte]: todaysDate,
      }
    );
  }

  return { dateQuery };
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
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const paginationData = (req, res) => {
  const dateQuery = '';
  let offset = 0;
  let prevPage;
  let nextPage;
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

  const { dateQuery: myDateQuery } = dateQueryFunc(dateQuery, date, res);

  // eslint-disable-next-line prefer-const
  let { automationRawQuery, myQueryCounter } = filterQuery(myDateQuery, slackAutomation, emailAutomation, freckleAutomation);

  return models.sequelize.query(myQueryCounter, { ...querySettings })
    .then(async (countData) => {
      const data = countData.shift();
      const page = parseInt(req.query.page, 10) || 1; // current page number
      const numberOfPages = Math.ceil(data.count / limit); // all pages count

      offset = limit * (page - 1);

      // check if number of pages is less than the current page number to show next page number
      if (page < numberOfPages) {
        nextPage = page + 1;
      }
      // show previous page number if page is greater than 1
      if (page > 1) {
        prevPage = page - 1;
      }


      automationRawQuery += ` ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
      const automationIds = await models.sequelize.query(
        automationRawQuery,
        { ...querySettings },
      );

      return automation.findAll({
        include,
        order,
        where: {
          id: {
            $in: automationIds.map($da => $da.id),
          },
        },
      })
        .then(allData => paginationResponse(res, allData, page, numberOfPages, data, nextPage, prevPage));
    });
};

export default class AutomationController {
  /**
   * @desc Gets automation results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and automation data
   */

  static getAutomations(req, res) {
    // if url doesn't contain a query objects send back all the data
    if (Object.entries(req.query).length === 0 && req.query.constructor === Object) {
      return checkQueryObject(res);
    }

    return paginationData(req, res);
  }
}
