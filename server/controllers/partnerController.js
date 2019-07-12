import db from '../models';
/**
 * @desc Endpoint for updating partner slack channel details usually before an automation retry
 *
 * @param {Object} req Request body containing partner id and updated partner info
 * @param {Object} res Request response object for handling REST response
 * @returns {Object} Response with updated partner data or error message
 */
export default async function updatePartnerSlackDetails(req, res) {
  const { id: partnerId } = req.params;
  const { slackChannels } = req.body;
  try {
    const partner = await db.Partner.findOne({
      where: { partnerId },
      attributes: { exclude: ['createdAt'] },
    });
    if (!partner) return res.status(404).json({ message: 'Partner does not exist' });
    const data = await partner.update({ slackChannels });
    return res.status(200).json({ message: 'Partner update successful', data });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}
