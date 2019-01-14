import ms from 'ms';

/**
 * @description calculate the uptime for the worker
 * @param {Date} date1 first date
 * @param {Date} date2 second sate
 *
 * @returns {Number} Duration in milliseconds
 */
export default function (date1, date2) {
  // Convert both dates to milliseconds
  const firstDate = date1.getTime();
  const secondDate = date2.getTime();

  const timeDifference = secondDate - firstDate;

  return ms(timeDifference, { long: true });
}
