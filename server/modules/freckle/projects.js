import axios from 'axios';

import response from '../../helpers/response';

const freckleUrl = 'https://api.letsfreckle.com/v2';

export async function getAllProjects() {
  try {
    const projects = await axios.get(`${freckleUrl}/projects?freckle_token=${process.env.FRECKLE_ADMIN_TOKEN}`);
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
      await axios.post(`${freckleUrl}/projects?freckle_token=${process.env.FRECKLE_ADMIN_TOKEN}`, {
        name: projectName,
      });
      return response(false, `${projectName} project successfully added`);
    }
    return response(false, `${projectName} project already created`);
  } catch (e) {
    return response(true, `Error occurred creating ${projectName} project`);
  }
};
