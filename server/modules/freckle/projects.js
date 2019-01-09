import axios from 'axios';
import dotenv from 'dotenv';

import response from '../../helpers/response';

// eslint-disable-next-line max-len
import { createOrUpdateFreckleAutomation } from '../../../db/operations/automations';

dotenv.config();
const freckleUrl = 'https://api.letsfreckle.com/v2';
const freckleToken = process.env.FRECKLE_ADMIN_TOKEN;

/**
 * @func saveFreckleProject
 * @desc Saves a freckle project to the DB
 *
 * @param {Object} projectDetails Details of the project
 * @param {string} message A message to store in the DB
 * @param {string} [status=success] success || failure
 *
 * @returns {void}
 */
const saveFreckleProject = async (projectDetails, message, status = 'success') => {
  const automationId = process.env.AUTOMATION_ID;
  await createOrUpdateFreckleAutomation({
    automationId,
    projectId: projectDetails.id,
    type: 'projectCreation',
    status,
    statusMessage: message,
  });
};

/**
 * @desc Get existing project on freckle or create new if not exists(save it to the database)
 *
 * @param {String} projectName The name of the project to be retrieved/created
 *
 * @returns {Object} If successful, return project details
 * @returns {Object} If unsuccessful, return error object
 */
export const getOrCreateProject = async (projectName) => {
  try {
    const name = { name: projectName };
    let { data: projectDetails } = await axios.get(
      `${freckleUrl}/projects?freckle_token=${freckleToken}&name=${projectName}`,
    );
    if (projectDetails.length) {
      saveFreckleProject(projectDetails, `${projectName} freckle project already exist`);
      return projectDetails;
    }
    ({ data: projectDetails } = await axios.post(`${freckleUrl}/projects?freckle_token=${freckleToken}`, name));
    saveFreckleProject(projectDetails, `${projectName} freckle project created`);
    return projectDetails;
  } catch (error) {
    saveFreckleProject({}, `${error.message}`, 'failure');
    return error;
  }
};
/**
 * @desc Gets a user id on freckle
 *
 * @param {string} email User email address whose id is to be retrieved
 *
 * @returns {number} The freckle id of the user
 */
export const getUserIdByEmail = async (email) => {
  const url = `${freckleUrl}/users?freckle_token=${freckleToken}&email=${email}`;
  const { data } = await axios.get(url);
  return data[0].id;
};

/**
 * @desc Assign a user to a project on freckle
 *
 * @param {string} email The email of the user to be assigned to a project
 * @param {number} projectId The ID of the project to be assigned to the user
 *
 * @returns {object} If successful, return success response
 * @returns {object} If unsuccessful, return error response
 */
export const assignProject = async (email, projectId) => {
  const automationId = process.env.AUTOMATION_ID;
  try {
    const userId = await getUserIdByEmail(email);
    const url = `${freckleUrl}/users/${userId}/give_access_to_projects?freckle_token=${freckleToken}`;
    await axios.put(url, { project_ids: [projectId] });
    await createOrUpdateFreckleAutomation({
      automationId,
      freckleUserId: userId,
      type: 'projectAssignment',
      status: 'success',
      statusMessage: `Assigned a freckle project to ${email}`,
    });
    return response(false, 'Successfully added developer to the project');
  } catch (error) {
    await createOrUpdateFreckleAutomation({
      automationId,
      freckleUserId: null,
      type: 'projectAssignment',
      status: 'failure',
      statusMessage: `${error.message}`,
    });
    return error;
  }
};
