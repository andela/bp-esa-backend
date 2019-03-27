/* eslint-disable max-len */
/* eslint-disable no-console */
import models from '../models';
import { formatAutomationResponse } from '../utils/formatter';

const automation = models.Automation;
export const include = [
  { model: models.EmailAutomation, as: 'emailAutomations' },
  { model: models.SlackAutomation, as: 'slackAutomations' },
  { model: models.FreckleAutomation, as: 'freckleAutomations' },
];

const order = [['createdAt', 'DESC']];

/**
 * Returns all data
 *
 * @param {object} res REST Response object
 * @returns {object} Response containing all data
 */
const checkQueryObject = res => automation.findAll({ include, order }).then(data => res.status(200).json({
  status: 'success',
  message: 'Successfully fetched automations',
  data: formatAutomationResponse(data),
}));

/**
 * Returns a response JSON object
 *
 * @param {object} res Response object
 * @param {object} allData data object returned from the database
 * @param {integer} page page number
 * @param {integer} numberOfPages total number of pages
 * @param {object} data data object
 * @param {integer} nextPage next page number
 * @param {integer} prevPage previous page number
 * @returns {object} Response containing paginated object
 */
const paginationResponse = (res, allData, page, numberOfPages, data, nextPage, prevPage) => res.status(200).json({
  status: 'success',
  message: 'Successfully fetched automations',
  data: formatAutomationResponse(allData),
  pagination: {
    currentPage: page,
    numberOfPages,
    dataCount: data.count,
    nextPage,
    prevPage,
  },
});

/**
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const paginationData = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  let offset = 0;
  let prevPage;
  let nextPage;

  return automation.findAndCountAll().then((data) => {
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
    return automation
      .findAll({
        include,
        limit,
        offset,
        order,
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

  // 1. filter failed emailAutomations, slackAutomations and freckleAutomations into three arrays respv
  // 2. create object with automation types  and their respective functions as key: value
  // 3. for each automation in failedFreckleAutomation:
  //    freckleAutomationObj[automation.type](automationDetails)
  // 4. Run step 3 for other failedAutomation arrays asynchronously using promise.All()
  // 5. Get that automation by id and return to user

  static async retryAutomation(req, res) {
    const automationDetails = await automation.findOne({
      include,
    });
    return res.status(200).json(automationDetails);
  }
}
