/**
 * @function makeChannelNames
 * @desc Create formatted slack channel names
 *
 * @param {string} partnerName Name of the partner
 * @param {string} channelType The type of channel: internal || general
 *
 * @returns {Object} An object containing the formated channel names
 */
const makeChannelNames = (partnerName, channelType) => {
  const shortened = partnerName.toLowerCase().replace(/llc|inc/g, '');
  const formattedName = shortened.replace(/[^a-zA-Z0-9]/g, '');

  return channelType === 'internal'
    ? `p-${formattedName.substring(0, 15)}-int`
    : `p-${formattedName.substring(0, 19)}`;
};

export default makeChannelNames;
