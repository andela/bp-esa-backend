import models from '../models';

const automation = models.Automation;
const include = [
  { model: models.EmailAutomation, as: 'emailAutomations' },
  { model: models.SlackAutomation, as: 'slackAutomations' },
  { model: models.FreckleAutomation, as: 'freckleAutomations' },
];
export default class AutomationController {
  /**
   * @desc Gets automation results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and automation data
   */

  static getAutomations(req, res) {
    return automation.findAll({ include }).then(data => res.status(200).json({
      status: 'success',
      message: 'Successfully fetched automations',
      data,
    }));
  }
}
