import axios from 'axios';
import dotenv from 'dotenv';

import response from '../../helpers/response';

dotenv.config();

const freckleUrl = 'https://api.letsfreckle.com/v2';
const freckleToken = process.env.FRECKLE_ADMIN_TOKEN;

/**
 * @function
 * @desc - An asynchronous function to get a project from freckle.
 * @param {string} name - name of freckle project
 * @returns {object} - If freckle-api transaction success, it returns a record of project.
 * @returns {boolean} - If freckle-api transaction fail, it returns false.
 */
export async function getProjectByName(name) {
  try {
    const project = await axios.get(`${freckleUrl}/projects?freckle_token=${freckleToken}&name=${name}`);
    return project.data;
  } catch (e) {
    return false;
  }
}

/**
 * @function
 * @desc - An asynchronous function to create a new project on freckle.
 * @param {String} projectName The name of the project to be created.
 * @returns {Object} If freckle-api transaction success, it return a success response object.
 * @returns {Object} - If freckle-api transaction fail, it return an error response object.
 */
export const createProject = async (projectName) => {
  try {
    let [project] = await getProjectByName(projectName);
    if (project) {
      project.existMessage = `${projectName} already exists as ${project.name}.`;
      return project;
    }
    await axios.post(`${freckleUrl}/projects?freckle_token=${freckleToken}`, {
      name: projectName,
    });

    project = await getProjectByName(projectName);
    return project;
  } catch (e) {
    throw new Error('Error occurred creating project');
  }
};

/**
 * @desc Get a user id with their email address on freckle
 *
 * @param {string} email user email address be assigned to a project
 *
 * @returns {number} Returns the freckle id of the user
 * @returns {null} Returns null if there is an error or the user does not exist on freckle
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
 * @param {number} projectId - The ID of the project to be assigned to the user.
 *
 * @returns {object} - A response object.
 */
export const assignProject = async (email, projectId) => {
  try {
    const userId = await getUserIdByEmail(email);
    if (userId) {
      const url = `${freckleUrl}/users/${userId}/give_access_to_projects?freckle_token=${freckleToken}`;
      await axios.put(url, { project_ids: [projectId] });
      return response(false, 'Successfully added developer to the project');
    }
    throw Error(`${email} have not been added to Andela freckle workspace`);
  } catch (error) {
    throw Error(`Error occurred adding ${email} to freckle`);
  }
};
