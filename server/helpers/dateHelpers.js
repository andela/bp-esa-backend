import ms from 'ms';
import moment from 'moment';

/**
 * @description calculate the uptime for the worker
 * @param {Date} date1 first date
 * @param {Date} date2 second sate
 *
 * @returns {Number} Duration in milliseconds
 */
export function daysBetween(date1, date2) {
  // Convert both dates to milliseconds
  const firstDate = date1.getTime();
  const secondDate = date2.getTime();

  const timeDifference = secondDate - firstDate;

  return ms(timeDifference, { long: true });
}

/**
 *@description validate is the date is a valid moment date
<<<<<<< HEAD
<<<<<<< HEAD
 * @param {Date} date1 - date object
 * @param {Date} date2 - date object
=======
 * @param {Date} date - date object
 * @returns {boolean} - true/false
 */
export function isValidDateFormat(date1, date2) {
  if ((date1 && !moment(date1).isValid()) || (date2 && !moment(date2).isValid())) {
    return false;
  }
  return true;
}

/**
 *@description compares start and end date, then returns a date object
 * @param {Date} date - date object
 * @returns {Date} - date object
 */
export function isValidStartDate({ endDate = moment(), startDate = moment().subtract(30, 'days') }) {
  const dateFrom = moment(startDate).format('YYYY-MM-DD');
  const dateTo = moment(endDate).format('YYYY-MM-DD');
  // check if date.from is greater than date.to or today, return an error
  if (dateFrom > dateTo) {
    throw new Error('startDate cannot be greater than endDate');
  }
  // check if both date from and to are provided
  return { dateFrom, dateTo };
}

/**
 * Define the difference between the start and end dates
 *
 * @param {object} duration - represents whether the query is days/months/years
 * @param {boolean} trends - represents if the request is for trends or stats endpoint
 *
 * @returns {number} - returns a date value
 */
const dateSubtractor = (duration, trends) => {
  let date;
  if (duration === 'days') {
    switch (trends) {
      case true:
        date = 30;
        return date;
      default:
        date = 0;
        return date;
    }
  }
  date = 1;
  return date;
};

/**
 * check if the duration selected is days/months/years
 *
 * @param {object} duration - check whether the query is days/months/years
 *
 * @returns {object} returns an error message
 */
export const checkDuration = (duration) => {
  if (duration !== 'days' && duration !== 'weeks' && duration !== 'months' && duration !== 'years') {
    const error = 'invalid duration input';
    return error;
  }
  return false;
};

/**
 * Return the start and end dates for a specific time period
 *
 * @param {object} date - date query from the request object
 * @param {boolean} trends - represents whether the request is for trends or stats endpoint
 * @param {number} duration - represents either days/months/years
 *
 * @returns {object} response of the start and end dates respectively
 */
export const validateDate = (date, trends, duration) => {
  const dateStart = date
    ? moment(date).subtract(dateSubtractor(duration, trends), duration).format('YYYY-MM-DD')
    : moment().subtract(dateSubtractor(duration, trends), duration).format('YYYY-MM-DD');

  const dateEnd = date
    ? moment(date).format('YYYY-MM-DD')
    : moment().format('YYYY-MM-DD');

  return { dateStart, dateEnd };
};
