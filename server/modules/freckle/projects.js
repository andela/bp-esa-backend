import axios from 'axios';
import dotenv from 'dotenv';

import response from '../../helpers/response';

dotenv.config();
const freckleUrl = 'https://api.letsfreckle.com/v2';
const freckleToken = process.env.FRECKLE_ADMIN_TOKEN;

/**
 * @desc Get existing project on freckle or create new if not exists
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
    if (projectDetails.length) return projectDetails;
    ({ data: projectDetails } = await axios.post(
      `${freckleUrl}/projects?freckle_token=${freckleToken}`,
      name,
    ));
    // write automation success to database
    return projectDetails;
  } catch (error) {
    // write automation failure to database
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
  try {
    const userId = await getUserIdByEmail(email);
    const url = `${freckleUrl}/users/${userId}/give_access_to_projects?freckle_token=${freckleToken}`;
    await axios.put(url, { project_ids: [projectId] });
    // write successful automation to database
    return response(false, 'Successfully added developer to the project');
  } catch (error) {
    // write unsuccessful automation to database
    return error;
  }
};
