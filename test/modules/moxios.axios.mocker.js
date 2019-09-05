import moxios from 'moxios';

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
