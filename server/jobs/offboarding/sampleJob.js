/* eslint-disable no-param-reassign */

/**
 * @function sampleJob
 * @desc A sample job.
 * @param {object} placement A single placement data from Allocations.
 * @param {object} result An object to write the result of the job to.
 * @returns {undefined} A job is not meant to return anything.
 */
const sampleJob = (placement, result) => {
  // Do something with the placement data
  const { fellowName } = placement;
  // Write the result of the job to the result object
  result.sampleOffboarding = `Sample offboarding job was executed for ${fellowName}`;
};

export default sampleJob;
