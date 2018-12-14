/* eslint-disable no-param-reassign */
import { getOrCreateProject, assignProject } from '../../modules/freckle/projects';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationResult Result of automation job
 * @returns {undefined}
 */
export default async (placement) => {
  const { fellow } = placement;
  getOrCreateProject(placement.client_name).then((project) => {
    if (project.id) assignProject(fellow.email, project.id);
  });
};
