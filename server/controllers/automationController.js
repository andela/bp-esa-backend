/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import { Op } from 'sequelize';
import models from '../models';
import { formatAutomationResponse } from '../utils/formatter';

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

// holds values needed for the status column
const statusValues = ['success', 'failure'];

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

const filterObjectInJSON = (req) => {
  try {
    // duplicate include object
    const includeWithWhereQuery = [...include];
    // fetch automation key values from JSON
    const { slackAutomation, emailAutomation, freckleAutomation } = req.body;

    // check if slackAutomation has either success or failure strings
    if (slackAutomation) {
      includeWithWhereQuery.forEach((queryModel) => {
        if (queryModel.as === 'slackAutomations' && statusValues.includes(slackAutomation)) {
          queryModel.where = { status: `${slackAutomation}` };
        }
      });
    }

    // check if emailAutomation has either success or failure strings
    if (emailAutomation) {
      includeWithWhereQuery.forEach((queryModel) => {
        if (queryModel.as === 'emailAutomations' && statusValues.includes(emailAutomation)) {
          queryModel.where = { status: `${emailAutomation}` };
        }
      });
    }

    // check if freckleAutomation has either success or failure strings
    if (freckleAutomation) {
      includeWithWhereQuery.forEach((queryModel) => {
        if (queryModel.as === 'freckleAutomations' && statusValues.includes(freckleAutomation)) {
          queryModel.where = { status: `${freckleAutomation}` };
        }
      });
    }

    return includeWithWhereQuery;
  } catch (error) {
    console.log(error);
  }
};


/**
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const paginationData = (req, res) => {
  let createdAt;
  let offset = 0;
  let prevPage;
  let nextPage;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { date } = req.body;

  // check if date object exists in the req body
  if (date) {
    // if date.from is greater than date.to or today, return an error
    if ((new Date(date.from) > new Date(date.to)) || (new Date(date.from) > new Date())) {
      return res.status(400).json({ error: 'date.from cannot be greater than date.now or today' });
    }
    // check if both date from and to are provided
    if (date.from && date.to) {
      createdAt = {
        [Op.between]: [date.from, date.to],
      };
    }

    // if only the date from is provided then return data up to now
    if (date.from && !date.to) {
      createdAt = {
        [Op.between]: [date.from, new Date()],
      };
    }

    // if only the date.to has been provided, return all data up to date.to
    if (!date.from && date.to) {
      createdAt = {
        [Op.lte]: date.to,
      };
    }
  } else {
    // if date object is not provided return all data up to today
    (
      createdAt = {
        [Op.lte]: new Date(),
      }
    );
  }


  return automation.findAndCountAll({
    where: {
      createdAt,
    },
  })
    .then(async (data) => {
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
      const { slackAutomation, emailAutomation, freckleAutomation } = req.query;
      let sql = 'SELECT a.id FROM automation as a '
      + `
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "slackAutomation"
        group by "automationId"
        ) as s
        on "s"."automationId"="a"."id"
        
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "emailAutomation"
        group by "automationId"
        ) as e
        on "e"."automationId"="a"."id"
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "freckleAutomation"
        group by "automationId"
        ) as f
        on "f"."automationId"="a"."id"
        where 1=1
      `;
      if (slackAutomation) {
        sql += 'AND "s"."status" = 0 ';
      }
      if (emailAutomation) {
        sql += 'AND "e"."status" = 0 ';
      }
      if (freckleAutomation) {
        sql += 'AND "f"."status" = 0 ';
      }
      const orderBy = order.map((item) => {
        return item.join(' ');
      }).join();
      sql += ` ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
      const automationIds = await models.sequelize.query(
        sql,
        {
          replacements: [
            slackAutomation || 'success',
            emailAutomation || 'success',
            freckleAutomation || 'success',
          ],
          type: models.sequelize.QueryTypes.SELECT,
        },
      );

      return automation.findAll({
        // include: filterObjectInJSON(req),
        include,
        // limit,
        // offset,
        // order,
        where: {
          id: {
            $in: automationIds.map(($da) => {
              return $da.id;
            }),
          },
        },
        logging: console.log,
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
