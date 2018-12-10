/**
 * @function makeChannelNames
 * @desc Create formatted slack channel names
 *
 * @param {string} partnerName Name of the partner
 * @returns {Object} An object containing the formated channel names
 */
const makeChannelNames = (partnerName) => {
  const shortened = partnerName.toLowerCase().replace(/llc|inc/g, '');
  const formattedName = shortened.replace(/[^a-zA-Z0-9]/g, '');

  // General channel: For all the stakeholders on the engagement - Andelans & Partners
  const genChannelName = `p-${formattedName.substring(0, 19)}`;
  // Internal channel: For only Andelans on the engagement
  const intChannelName = `p-${formattedName.substring(0, 15)}-int`;

  return { genChannelName, intChannelName };
};

export default makeChannelNames;
