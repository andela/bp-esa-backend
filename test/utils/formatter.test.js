import {
  objectCopy,
  getOveralStatus,
  formatAutomations,
  formatPayload,
  formatAutomationResponse,
} from '../../server/utils/formatter';
import { automationsMockData, expectedReponseMockData } from '../mocks/automations';

describe('API Response Payload Formatter', () => {
  it('should return overall status of the slack automations', () => {
    expect(getOveralStatus(automationsMockData[0].slackAutomations)).to.equal('failure');
    expect(getOveralStatus(automationsMockData[0].emailAutomations)).to.equal('success');
  });

  it('should return a formatted copy object', () => {
    const props = ['fellowId', 'fellowName', 'notProp'];
    const copy = objectCopy(automationsMockData[0], props);
    Object.is(copy, { fellowName: 'Kelvin Kariuki', fellowId: '-KXGy1MT1oimjQgFimAd' });
  });

  it('should format automations payload', () => {
    const formatedResponse = formatAutomations(
      automationsMockData[0].slackAutomations,
      'slackActivities',
      ['status', 'statusMessage', 'type', 'channelId', 'channelName', 'slackUserId'],
    );
    Object.is(formatedResponse, expectedReponseMockData[0].slackAutomations);
  });

  it('should format single automation payload', () => {
    const formatedResponse = formatPayload(automationsMockData[0]);
    Object.is(formatedResponse, expectedReponseMockData[0]);
  });

  it('should format automations payload', () => {
    const formatedResponse = formatAutomationResponse(automationsMockData);
    Object.is(formatedResponse, expectedReponseMockData);
  });
});
