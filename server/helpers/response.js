/**
 * @desc - An helper function for sending response.
 * @param {Boolean} error - A truthy value to tell if there was an error or not.
 * @param {String} message - The message to send as part of the response.
 * @param {*} data - The data to send as part of the response.
 * @returns {Object} The response object.
 */
const response = (error, message, data) => (
  data ? { error, message, data } : { error, message }
);

export default response;
