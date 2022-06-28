const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await axios.get('https://httpbin.org/ip');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await axios.get('https://httpbin.org/get', { query });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.config.query).to.eql(query);
  });

  it('Consume DELETE Service with query parameters', async () => {
    const response = await axios.delete('https://httpbin.org/delete');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.data).to.be.empty;
  });

  it('Consume PUT Service with query parameters', async () => {
    const body = {
      name: 'Test_name',
      data: 'Version 2.0',
      files: ['datafiles', 'javascriptfil']
    };

    const response = await axios.put('https://httpbin.org/put', body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(JSON.parse(response.data.data)).to.eql(body);
  });

  it('Consume PATCH Service with query parameters', async () => {
    const body = {
      name: 'Test Verify'
    };

    const response = await axios.patch('https://httpbin.org/patch', body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(body);
  });

  it('Consume HEAD Service with query parameters', async () => {
    const response = await axios.head('https://httpbin.org/headers');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.be.empty;
  });
});
