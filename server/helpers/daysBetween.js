import ms from 'ms';

export default function (date1, date2) {
  // Convert both dates to milliseconds
  const firstDate = date1.getTime();
  const secondDate = date2.getTime();

  const timeDifference = secondDate - firstDate;

  return ms(timeDifference, { long: true });
}
