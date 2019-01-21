import {
  getOveralStatus,
  formatSlackAutomations,
  formatFreckleAutomations,
  formatEmailAutomations,
  formatAutomation,
  formatAutomationResponse,
} from '../../server/utils/formatter';
import { automationsMockData, expectedReponseMockData } from '../mocks/automations';

describe('API Response Payload Formatter', () => {
  it('should return overall status of the slack automations', () => {
    expect(getOveralStatus(automationsMockData[0].slackAutomations)).to.equal('failure');
  });

  it('should format slack automations payload', () => {
    const formatedResponse = formatSlackAutomations(automationsMockData[0].slackAutomations);
    Object.is(formatedResponse, expectedReponseMockData[0].slackAutomations);
  });

  it('should format freckle automations payload', () => {
    const formatedResponse = formatFreckleAutomations(automationsMockData[0].freckleAutomations);
    Object.is(formatedResponse, expectedReponseMockData[0].freckleAutomations);
  });

  it('should format email automations payload', () => {
    const formatedResponse = formatEmailAutomations(automationsMockData[0].emailAutomations);
    Object.is(formatedResponse, expectedReponseMockData[0].emailAutomations);
  });

  it('should format single automation payload', () => {
    const formatedResponse = formatAutomation(automationsMockData[0]);
    Object.is(formatedResponse, expectedReponseMockData[0]);
  });

  it('should format automations payload', () => {
    const formatedResponse = formatAutomationResponse(automationsMockData);
    Object.is(formatedResponse, expectedReponseMockData);
  });
});
