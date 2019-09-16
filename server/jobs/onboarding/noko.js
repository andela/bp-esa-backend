import db from '../../models';
import { getOrCreateProject, assignProject } from '../../modules/noko/projects';
import { createOrUpdateNokoAutomation } from '../../modules/automations';

/**
 * @desc Automates noko developer onboarding.
 *
 * @param {Object} placement Placement record whose developer is to be onboarded
 * @param {Object} partner Partner details to be used in the automation
 * @param {Object} automationId Result of automation job
 * @returns {Promise} Promise to return the result of partner upserted after automation
 */
const nokoOnboarding = async (placement, partner, automationId) => {
  const { fellow, client_id: partnerId } = placement;
  getOrCreateProject(placement.client_name).then(async (project) => {
    createOrUpdateNokoAutomation({ ...project, automationId });
    assignProject(fellow.email, project.projectId)
      .then(result => createOrUpdateNokoAutomation({ ...result, automationId }));
    return db.Partner.findOne({ where: { partnerId } }).then(foundPartner => (foundPartner
      ? foundPartner.update({
        nokoProjectId: project.projectId,
      })
      : null));
  });
};

export default nokoOnboarding;
