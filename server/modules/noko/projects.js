import axios from 'axios';
import dotenv from 'dotenv';
import models from '../../models';

dotenv.config();
const nokoUrl = 'https://api.nokotime.com/v2';
const nokoToken = process.env.NOKO_ADMIN_TOKEN;

/**
 * @func saveNokoProject
 * @desc Saves a noko project to the DB
 *
 * @param {Object} projectDetails Details of the project
 * @param {string} message A message to store in the DB
 * @param {string} [status=success] success || failure
 *
 * @returns {void}
 */
class Noko {
  static saveNokoProject(projectDetails, message, status = 'success') {
    return {
      projectId: (projectDetails && projectDetails.id) || null,
      type: 'projectCreation',
      status,
      statusMessage: message,
    };
  }

  /**
   * @desc Get existing project on noko or create new if not exists(save it to the database)
   *
   * @param {String} projectName The name of the project to be retrieved/created
   *
   * @returns {Object} If successful, return project details
   * @returns {Object} If unsuccessful, return error object
   */
  static async getOrCreateProject(projectName) {
    try {
      if (!projectName) {
        return this.saveNokoProject(
          {},
          'Project name cannot be null undefined',
          'failure',
        );
      }

      const name = { name: projectName };
      let { data: projectDetails } = await axios.get(
        `${nokoUrl}/projects?noko_token=${nokoToken}&name=${projectName}`,
      );
      if (projectDetails.length) {
        return this.saveNokoProject(projectDetails[0], `${projectName} noko project already exist`);
      }
      ({ data: projectDetails } = await axios.post(
        `${nokoUrl}/projects?noko_token=${nokoToken}`,
        name,
      ));
      return this.saveNokoProject(projectDetails, `${projectName} noko project created`);
    } catch (error) {
      return this.saveNokoProject({}, `${error.message}`, 'failure');
    }
  }

  /**
   * @desc Gets a user id on noko
   *
   * @param {string} email User email address whose id is to be retrieved
   *
   * @returns {number} The noko id of the user
   */
  static async getUserIdByEmail(email) {
    const url = `${nokoUrl}/users?noko_token=${nokoToken}`;
    const { data } = await axios.get(`${url}&email=${email}`);
    if (data[0]) {
      return data[0].id;
    }

    const { fellowName } = await models.Automation.findOne({
      where: { email },
      order: [['createdAt', 'DESC']],
    });
    const userData = {
      email,
      first_name: fellowName.split(',')[0],
      last_name: fellowName.split(',')[1],
    };
    const newData = await axios.post(url, userData);
    return newData.data.id;
  }

  /**
   * @desc Assign a user to a project on noko
   *
   * @param {string} email The email of the user to be assigned to a project
   * @param {number} projectId The ID of the project to be assigned to the user
   *
   * @returns {object} If successful, return success response
   * @returns {object} If unsuccessful, return error response
   */
  static async assignProject(email, projectId) {
    try {
      const userId = await this.getUserIdByEmail(email);
      const url = `${nokoUrl}/users/${userId}/give_access_to_projects?noko_token=${nokoToken}`;
      await axios.put(url, { project_ids: [projectId] });
      return {
        nokoUserId: userId,
        type: 'projectAssignment',
        status: 'success',
        statusMessage: `Assigned a noko project to ${email}`,
      };
    } catch (error) {
      return {
        nokoUserId: null,
        type: 'projectAssignment',
        status: 'failure',
        statusMessage: `${error.response ? error.response.data.message : error.message}`,
      };
    }
  }
}
export default Noko;
