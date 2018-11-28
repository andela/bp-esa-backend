import axios from 'axios';
import dotenv from 'dotenv';

import response from '../../helpers/response';

dotenv.config();

const freckleUrl = 'https://api.letsfreckle.com/v2';
const freckleToken = process.env.FRECKLE_ADMIN_TOKEN;

/**
 * @function
 * @desc - An asynchronous function to get all projects from freckle.
 * @returns {Array} - If freckle-api transaction success, it returns a list of project.
 * @returns {Object} - If freckle-api transaction fail, it returns the transaction error.
 */
export async function getAllProjects() {
  try {
    const projects = await axios.get(`${freckleUrl}/projects?freckle_token=${freckleToken}`);
    return projects.data;
  } catch (e) {
    return e.data;
  }
}

/**
 * @function
 * @desc - A function to check/verify if a project already exist in a list of freckle projects.
 * @param {Array} projects - The list of freckle projects.
 * @param {String} projectName - The name of the project to check.
 * @returns {Boolean} - A truthy value representing if the project exist or not.
 */
const verifyExistingProject = (projects, projectName) => {
  const project = projects.filter(eachProject => eachProject.name === projectName);
  if (!project.length) {
    return false;
  }
  return true;
};

/**
 * @function
 * @desc - An asynchronous function to create a new project on freckle.
 * @param {String} projectName The name of the project to be created.
 * @returns {Object} If freckle-api transaction success, it return a success response object.
 * @returns {Object} - If freckle-api transaction fail, it return an error response object.
 */
export const createProject = async (projectName) => {
  try {
    const projects = await getAllProjects();
    if (projects && projects.length > 0 && !verifyExistingProject(projects, projectName)) {
      await axios.post(`${freckleUrl}/projects?freckle_token=${freckleToken}`, {
        name: projectName,
      });
      return response(false, `${projectName} project successfully added`);
    }
    return response(false, `${projectName} project already created`);
  } catch (e) {
    return response(true, `Error occurred creating ${projectName} project`);
  }
};

/**
 * @desc Get a user id with their email address on freckle
 *
 * @param {string} email - user email address be assigned to a project
 *
 * @returns {promise} - Axios response for request to get userId from email
 */
export const getUserIdByEmail = async (email) => {
  const url = `${freckleUrl}/users?freckle_token=${freckleToken}&email=${email}`;
  try {
    const user = await axios.get(url);
    const { id } = user.data[0];
    if (id) {
      return id;
    }
    return null;
  } catch (_) {
    return null;
  }
};

/**
 * @desc Assign a user to a project on freckle
 *
 * @param {string} email - email of the user to be assigned to a project
 * @param {number} projectId - Array of integer projectIds to be assigned to the user.
 *
 * @returns {object} - Axios response for request to assign user to freckle project
 */
export const assignProject = async (email, projectId) => {
  try {
    const userId = await getUserIdByEmail(email);
    if (userId) {
      const url = `${freckleUrl}/users/${userId}/give_access_to_projects?freckle_token=${freckleToken}`;
      await axios.put(url, { project_ids: [projectId] });
      return response(false, 'Successfully added developer to the project');
    }

    return response(true, 'Cannot add invalid user to project');
  } catch (error) {
    return response(true, error);
  }
};
