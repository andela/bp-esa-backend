import { getOrCreateProject, assignProject } from '../../modules/freckle/projects';
import { creatOrUpdatePartnerRecord, createOrUpdateFreckleAutomation } from '../../modules/automations';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationId Result of automation job
 * @returns {undefined}
 */
const freckleOnboarding = async (placement, automationId) => {
  const { fellow, client_id: partnerId, client_name: partnerName } = placement;
  getOrCreateProject(placement.client_name).then(async (project) => {
    createOrUpdateFreckleAutomation({ ...project, automationId });
    assignProject(fellow.email, project.id)
      .then(result => createOrUpdateFreckleAutomation({ ...result, automationId }));
    creatOrUpdatePartnerRecord({
      partnerId,
      name: partnerName,
      freckleProjectId: project.id,
    });
  });
};

export default freckleOnboarding;
