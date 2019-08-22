import sinon from 'sinon';
import moxios from 'moxios';
import models from '../../../server/models';
import Noko from '../../../server/modules/noko/projects';
import { automationCreateData } from '../../mocks/automations';
import {
  mockNokoGetCreateUser,
  mockNokogetCreateProject,
  mockNockAssignProject,
} from '../moxios.axios.mocker';

describe('Noko Project', () => {
  beforeEach(async () => {
    moxios.install();
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
    await models.Automation.bulkCreate(automationCreateData);
  });
  afterEach(async () => {
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
    moxios.uninstall();
  });
  const { email } = automationCreateData[0];
  describe('getUserIdByEmail', () => {
    it('should return userId when they exist on noko', async () => {
      mockNokoGetCreateUser(`&email=${email}`, 200, [{ id: 5 }]);
      const userId = await Noko.getUserIdByEmail(email);
      expect(userId).to.equal(5);
    });

    it('should return userId from Automation they exist on noko', async () => {
      mockNokoGetCreateUser(`&email=${email}`, 200, {});
      mockNokoGetCreateUser('', 201, { id: 5432 });
      const userId = await Noko.getUserIdByEmail(email);
      expect(userId).to.equal(5432);
    });
  });
  describe('saveNokoProject', () => {
    it('should return error messages successfully', () => {
      const nokoError = Noko.saveNokoProject({}, 'this is an error message', 'failure');

      expect(nokoError.statusMessage).to.equal('this is an error message');
      expect(nokoError.status).to.equal('failure');
    });

    it('should return success messages', () => {
      const nokoSuccess = Noko.saveNokoProject({ id: 3 }, 'this is an sucess message');
      expect(nokoSuccess.status).to.equal('success');
    });
  });
  describe('getOrCreateProject', () => {
    const name = 'someRandomName';
    it('should return projectId when they it exists on noko', async () => {
      mockNokogetCreateProject(`&name=${name}`, 200, [{ id: 5 }]);
      const projectDetails = await Noko.getOrCreateProject(name);
      expect(projectDetails.projectId).to.equal(5);
      expect(projectDetails.status).to.equal('success');
      expect(projectDetails.statusMessage).to.equal(
        'someRandomName noko project already exist',
      );
    });

    it('should return projectId after creating it on noko', async () => {
      mockNokogetCreateProject(`&name=${name}`, 200, []);
      mockNokogetCreateProject('', 201, { id: 2 });
      const projectDetails = await Noko.getOrCreateProject(name);
      expect(projectDetails.projectId).to.equal(2);
      expect(projectDetails.status).to.equal('success');
      expect(projectDetails.statusMessage).to.equal(
        'someRandomName noko project created',
      );
    });
    it('should know when project name is not defined', async () => {
      const projectDetails = await Noko.getOrCreateProject(undefined);
      expect(projectDetails.projectId).to.equal(null);
      expect(projectDetails.status).to.equal('failure');
      expect(projectDetails.statusMessage).to.equal(
        'Project name cannot be null undefined',
      );
    });
  });
  describe('assignProject', () => {
    it('should assign a user to a project', async () => {
      mockNokoGetCreateUser(`&email=${email}`, 200, [{ id: 5 }]);
      mockNockAssignProject(1, 200, 20000);
      sinon.stub(Noko, 'getUserIdByEmail').returns(1);
      const assignedProject = await Noko.assignProject(email, 1);
      expect(assignedProject.statusMessage).to.equal(
        `Assigned a noko project to ${email}`,
      );
      expect(assignedProject.status).to.equal('success');
      sinon.restore();
    });
    it('should catch errors passed within method', async () => {
      mockNokoGetCreateUser(`&email=${email}`, 200, [{ id: 5 }]);
      mockNockAssignProject(1, 200, 20000);
      sinon
        .stub(Noko, 'getUserIdByEmail')
        .throws(new Error('esa can catch errors'));
      const caughtError = await Noko.assignProject(email, 1);
      expect(caughtError.nokoUserId).to.equal(null);
      expect(caughtError.status).to.equal('failure');
      expect(caughtError.statusMessage).to.equal('esa can catch errors');
      sinon.restore();
    });
  });
});
