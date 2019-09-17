import ms from "ms";
import moment from "moment";

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
 * @param {Date} date - date object
 * @returns {boolean} - true/false
 */
export function isValidDateFormat(date1, date2) {
  if ((date1 && !moment(date1).isValid()) || (date2 && !moment(date2).isValid())) 
  {
    return false;
  }
  return true;
}

/**
 *@description compares start and end date, then returns a date object
 * @param {Date} date - date object
 * @returns {Date} - date object
 */
export function isValidStartDate ({ endDate =  moment(), startDate = moment().subtract(30, 'days')}){  
  // eslint-disable-next-line no-unused-vars2
  const dateFrom = moment(startDate).format("YYYY-MM-DD");
  const dateTo = moment(endDate).format("YYYY-MM-DD");
  // check if date.from is greater than date.to or today, return an error
  if (dateFrom > dateTo) {
    throw new Error("startDate cannot be greater than endDate");
  }
  // check if both date from and to are provided
  if (dateFrom && dateTo) {
    return { dateFrom, dateTo };
  }
};
