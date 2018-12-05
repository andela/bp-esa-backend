/**
 * @function makeChannelNames
 * @desc Create formatted slack channel names
 *
 * @param {string} partnerName - Name of the partner
 * @returns {Object} - An object containing the formated channel names
 */
const makeChannelNames = (partnerName) => {
  const shortened = partnerName.toLowerCase().replace(/llc|inc/g, '');
  const formattedName = shortened.replace(/[^a-zA-Z0-9]/g, '');

  // For all the participants of the engagement - Andelans & Partners
  const generalChannel = `p-${formattedName.substring(0, 19)}`;
  // For only Andelans in the engagement
  const internalChannel = `p-${formattedName.substring(0, 15)}-int`;

  return { generalChannel, internalChannel };
};

export default makeChannelNames;
