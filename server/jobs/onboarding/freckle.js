/* eslint-disable no-param-reassign */
import { getOrCreateProject, assignProject } from '../../modules/freckle/projects';
import { saveFreckleAutomation } from '../../../db/operations/automations';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationResult Result of automation job
 * @returns {undefined}
 */
export default async (placement) => {
  const { fellow, id: partnerId } = placement;
  getOrCreateProject(placement.client_name).then(async (project) => {
    if (project.id) {
      assignProject(fellow.email, project.id);
      saveFreckleAutomation(partnerId, project.id);
    }
  });
};
