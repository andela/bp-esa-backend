/* eslint-disable no-param-reassign */
import { createProject, assignProject } from '../../modules/freckle/projects';

/**
 * @desc Automates developer offboarding on slack
 *
 * @param {array} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
export default async (placement, automationResult) => {
  const { fellow } = placement;
  try {
    const project = await createProject(placement.client_name);
    const response = await assignProject(fellow.email, project.id);

    if (!response.error) {
      automationResult.freckleAutomation = 'success';
    }
    if (response.error) {
      automationResult.freckleAutomation = 'failure';
    }
  } catch (e) {
    automationResult.freckleAutomation = 'failure';
  }
};
