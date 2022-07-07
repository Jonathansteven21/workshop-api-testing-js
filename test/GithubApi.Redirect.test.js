const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const repo = {
  url: 'https://github.com/aperdomob/redirect-test',
  responseUrl: 'https://github.com/aperdomob/new-redirect-test'
};

describe('Github consume head and get Api Test', () => {
  it('Consume HEAD service', async () => {
    const response = await axios.head(repo.url);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.request.res.responseUrl).to.equal(repo.responseUrl);
  });

  it('Consume GET service', async () => {
    const response = await axios.get(repo.url);
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.request.res.responseUrl).to.equal(repo.responseUrl);
  });
});
