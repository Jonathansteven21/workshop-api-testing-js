const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const baseUrl = 'https://api.github.com/users';

describe('Github consume GET Api Users Test', () => {
  it('Github consumes the GET service to test the API from users', async () => {
    const response = await axios.get(baseUrl);
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data.length).to.equal(30);
  });

  it('Github consumes the GET service to count 10 users', async () => {
    const params = { per_page: 10 };
    const response = await axios.get(baseUrl, { params });
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data.length).to.equal(10);
  });

  it('Github consumes the GET service to count 100 users', async () => {
    const params = { per_page: 100 };
    const response = await axios.get(baseUrl, { params });
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data.length).to.equal(100);
  });
});
