const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
require('isomorphic-fetch');

const headers = {
  Authorization: `token ${process.env.ACCESS_TOKEN}`
};

const gist = {
  url: ''
};

const urlBase = 'https://api.github.com';

describe('Github Delete and a Nonexistent Resource Test with Fetch', () => {
  it('Create a Gist with Fetch', async () => {
    const gistExample = {
      description: 'Example of a gist',
      public: false,
      files: { 'README.md': { content: 'Hello World' } }
    };

    const response = await fetch(`${urlBase}/gists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(gistExample)
    });
    expect(response.status).to.equal(StatusCodes.CREATED);

    const data = await response.json();
    gist.url = data.url;
    expect(data).to.containSubset(gistExample);
  });

  it('Verify the Gist created with Fetch', async () => {
    const response = await fetch(gist.url, {
      method: 'GET',
      headers
    });
    expect(response.status).to.equal(StatusCodes.OK);
    const data = await response.json();

    expect(data.url).to.be.not.empty;
  });

  it('Consume Delete Service by Gist created with Fetch', async () => {
    const response = await fetch(gist.url, {
      method: 'DELETE',
      headers
    });
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
  });

  it('Verify that the Gist does not exist with Fetch', async () => {
    const response = await fetch(gist.url, {
      method: 'GET',
      headers
    });
    expect(response.status).to.equal(StatusCodes.NOT_FOUND);
  });
});
