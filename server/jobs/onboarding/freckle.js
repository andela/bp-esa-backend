/* eslint-disable no-param-reassign */
import db from '../../models';
import { getOrCreateProject, assignProject } from '../../modules/freckle/projects';
import { createOrUpdateFreckleAutomation } from '../../modules/automations';

/**
 * @desc Automates freckle developer onboarding.
 *
 * @param {Object} placement Placement record whose developer is to be onboarded
 * @param {Object} partner Partner details to be used in the automation
 * @param {Object} automationId Result of automation job
 * @returns {Promise} Promise to return the result of partner upserted after automation
 */
const freckleOnboarding = async (placement, partner, automationId) => {
  const { fellow, client_id: partnerId } = placement;
  getOrCreateProject(placement.client_name).then(async (project) => {
    createOrUpdateFreckleAutomation({ ...project, automationId });
    assignProject(fellow.email, project.id).then(result => createOrUpdateFreckleAutomation({ ...result, automationId }));
    return db.Partner.findOne({ where: { partnerId } }).then(foundPartner => (foundPartner
      ? foundPartner.update({
        freckleProjectId: project.id,
      })
      : null));
  });
};

export default freckleOnboarding;
