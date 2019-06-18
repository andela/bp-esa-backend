/* eslint-disable no-param-reassign */
import db from '../../models';
import { getOrCreateProject, assignProject } from '../../modules/freckle/projects';
import { createOrUpdateFreckleAutomation } from '../../modules/automations';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {Object} placement Placement record whose developer is to be onboarded
 * @param {Object} automationId Result of automation job
 * @returns {Promise} Promise to return the result of partner upserted after automation
 */
const freckleOnboarding = async (placement, automationId) => {
  const { fellow, client_id: partnerId, client_name: partnerName } = placement;
  getOrCreateProject(placement.client_name).then(async (project) => {
    createOrUpdateFreckleAutomation({ ...project, automationId });
    assignProject(fellow.email, project.id).then(result => createOrUpdateFreckleAutomation({ ...result, automationId }));
    return db.Partner.upsert({
      partnerId,
      name: partnerName,
      freckleProjectId: project.id,
    });
  });
};

export default freckleOnboarding;
