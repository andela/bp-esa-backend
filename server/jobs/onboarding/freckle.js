/* eslint-disable no-param-reassign */
import { createProject, assignProject } from '../../modules/freckle/projects';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationResult Result of automation job
 * @returns {undefined}
 */
export default async (placement, automationResult) => {
  const { fellow } = placement;
  try {
    const project = await createProject(placement.client_name);
    await assignProject(fellow.email, project.id);
    automationResult.freckleAutomation = 'success';
  } catch (e) {
    automationResult.freckleAutomation = 'failure';
  }
};
