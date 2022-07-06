const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const instance = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});

const gist = {
  url: ''
};

const urlBase = 'https://api.github.com';

describe('Github Delete and a Nonexistent Resource Test', () => {
  it('Create a Gist', async () => {
    const gistExample = {
      description: 'Example of a gist',
      public: false,
      files: { 'README.md': { content: 'Hello World' } }
    };

    const response = await instance.post(`${urlBase}/gists`, gistExample);
    expect(response.status).to.equal(StatusCodes.CREATED);

    expect(response.data).to.containSubset(gistExample);
    gist.url = response.data.url;
  });

  it('Verify the Gist created', async () => {
    const response = await instance.get(gist.url);
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data).to.be.not.empty;
  });

  it('Consume Delete Service by Gist created', async () => {
    const response = await instance.delete(gist.url);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.be.empty;
  });

  it('Verify that the Gist does not exist', async () => {
    instance.get(gist.url).catch((error) => {
      if (error.response) {
        expect(error.response.status).to.equal(StatusCodes.NOT_FOUND);
      }
    });
  });
});
