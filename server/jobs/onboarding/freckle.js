/* eslint-disable no-param-reassign */
import { getOrCreateProject, assignProject } from '../../modules/freckle/projects';
import { creatOrUpdatePartnerRecord } from '../../modules/automations';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationResult Result of automation job
 * @returns {undefined}
 */
const freckleOnboarding = async (placement) => {
  const { fellow, client_id: partnerId, client_name: partnerName } = placement;
  getOrCreateProject(placement.client_name).then((project) => {
    if (project.id) {
      assignProject(fellow.email, project.id);
      creatOrUpdatePartnerRecord({
        partnerId,
        name: partnerName,
        freckleProjectId: project.id,
      });
    }
  });
};

export default freckleOnboarding;
