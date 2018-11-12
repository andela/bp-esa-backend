import axios from 'axios';
import dotenv from 'dotenv';

import response from '../../helpers/response';

dotenv.config();

const freckleUrl = 'https://api.letsfreckle.com/v2';
const freckleToken = process.env.FRECKLE_ADMIN_TOKEN;

export async function getAllProjects() {
  try {
    const projects = await axios.get(`${freckleUrl}/projects?freckle_token=${freckleToken}`);
    return projects.data;
  } catch (e) {
    return e.data;
  }
}

function verifyExistingProject(projects, projectName) {
  const project = projects.filter(eachProject => eachProject.name === projectName);
  if (!project.length) {
    return false;
  }
  return true;
}

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
 * @desc Assign a user to a project on freckle
 *
 * @param {number} userId - Id of the user to be assigned to a project
 * @param {array} projectIds - Array of integer projectIds to be assigned to the user.
 *
 * @returns {promise} - Axios response for request to assign user to freckle project
 */
export const assignProject = (userId, projectIds) => {
  const url = `${freckleUrl}/users/${userId}/give_access_to_projects?freckle_token=${freckleToken}`;
  return axios
    .put(url, {
      project_ids: projectIds,
    })
    .then(() => response(false, 'Successfully added developer to the project'))
    .catch(error => response(true, error));
};
