import moxios from 'moxios';

const mockAndelaAPIRequests = (partnerId) => {
  moxios.stubRequest(`${process.env.ANDELA_PARTNERS}/${partnerId}`, {
    status: 200,
    response: {
      id: 'ABCDEFZYXWVU',
      name: 'Sample Partner',
      location: 'San Francisco California, United States',
      salesforce_id: '012345ABCDEF',
      onboarding_specialist: 'n/a',
      director_of_success: '',
      technical_success_manager: '',
      client_experience_lead: 'John Doe',
      client_executive: 'John Doe',
      start_date: '',
      end_date: '',
      updated_at: '2017-11-30T21:14:54.291Z',
      created_at: '2017-07-28T14:22:28.000Z',
      status: 'Onboarding Partner',
      health: [],
      description: '',
      client_size: '',
      technical_coordinator: '',
      channel_id: '',
      channel_name: '',
      type: 'Onboarding',
      technical_success_manager_id: '',
      director_of_success_id: '',
    },
  });
};
const nokoUrl = 'https://api.nokotime.com/v2';
const nokoToken = process.env.NOKO_ADMIN_TOKEN;
export const mockNokoGetCreateUser = (email, statusCode, responseData) => {
  moxios.stubRequest(`${nokoUrl}/users?noko_token=${nokoToken}${email}`, {
    status: statusCode,
    response: responseData,
  });
};
export const mockNokogetCreateProject = (name, statusCode, responseData) => {
  moxios.stubRequest(`${nokoUrl}/projects?noko_token=${nokoToken}${name}`, {
    status: statusCode,
    response: responseData,
  });
};
export const mockNockAssignProject = (userId, statusCode, responseData) => {
  moxios.stubRequest(
    `${nokoUrl}/users/${userId}/give_access_to_projects?noko_token=${nokoToken}`,
    {
      status: statusCode,
      response: responseData,
    },
  );
};
export const mockSlackApi = () => {
  moxios.stubRequest('https://slack.com/api/', {
    status: 200,
    response: 'data',
  });
};

export default mockAndelaAPIRequests;
