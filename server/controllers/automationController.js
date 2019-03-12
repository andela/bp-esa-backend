import models from '../models';
import { formatAutomationResponse } from '../utils/formatter';

const automation = models.Automation;
export const include = [
  { model: models.EmailAutomation, as: 'emailAutomations' },
  { model: models.SlackAutomation, as: 'slackAutomations' },
  { model: models.FreckleAutomation, as: 'freckleAutomations' },
];
const order = [['createdAt', 'DESC']];
export default class AutomationController {
  /**
   * @desc Gets automation results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and automation data
   */
  static getAutomations(req, res) {
    return automation.findAll({ include, order }).then(data => res.status(200).json({
      status: 'success',
      message: 'Successfully fetched automations',
      data: formatAutomationResponse(data),
    }));
  }
}
