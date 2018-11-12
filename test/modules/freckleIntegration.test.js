import sinon from 'sinon';
import axios from 'axios';
import { assignProject } from '../../server/modules/freckle/projects';

describe('Freckle Integration Test Suite', async () => {
  it('Should assign a developer to projects on freckle', async () => {
    // Mock successful request
    const fakeAxiosPut = sinon.stub(axios, 'put').callsFake(
      () => new Promise((resolve) => {
        resolve();
      }),
    );
    const result = await assignProject(70802, [524459, 524458, 524272, 524271]);
    expect(result.error).to.equal(false);
    expect(result.message).to.equal('Successfully added developer to the project');
    fakeAxiosPut.restore();
  });
  it('Should return error response when api call fails', async () => {
    const errorResponse = new Error('Something went wrong');
    // Mock failed request
    const fakeAxiosPut = sinon.stub(axios, 'put').callsFake(
      () => new Promise((resolve, reject) => {
        reject(errorResponse);
      }),
    );
    const result = await assignProject(70802, [524459, 524458, 524272, 524271]);
    expect(result.error).to.equal(true);
    expect(result.message).to.equal(errorResponse);
    fakeAxiosPut.restore();
  });
});
