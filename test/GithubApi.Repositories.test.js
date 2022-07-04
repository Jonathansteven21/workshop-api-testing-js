const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const md5 = require('md5');

chai.use(chaiSubset);

const user = {
  url: 'https://api.github.com/users/aperdomob',
  repository: {
    readme: {}
  }
};

describe('Github Repositories Tests', () => {
  it('Consume GET Service', async () => {
    const response = await axios.get(user.url);
    expect(response.status).to.equal(StatusCodes.OK);

    user.repositories = response.data.repos_url;

    expect(response.data.name).to.equal('Alejandro Perdomo');
    expect(response.data.company).to.equal('Perficient Latam');
    expect(response.data.location).to.equal('Colombia');
  });

  it('Consume GET Service to save repository list', async () => {
    const response = await axios.get(user.repositories);
    expect(response.status).to.equal(StatusCodes.OK);

    const repository = response.data.find(
      (repo) => repo.name === 'jasmine-json-report'
    );

    user.repository.url = repository.url;
    expect(repository.full_name).to.equal('aperdomob/jasmine-json-report');
    expect(repository.private).to.be.false;
    expect(repository.description).to.equal('A Simple Jasmine JSON Report');
  });

  it('Consume GET service to save repository in zip', async () => {
    const response = await axios.get(`${user.repository.url}/zipball/master`, {
      headers: {
        Authorization: `${process.env.ACCESS_TOKEN}`
      }
    });
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.headers['content-type']).to.equal('application/zip');
  });

  it('Consume GET Service to obtain repository files', async () => {
    const response = await axios.get(`${user.repository.url}/contents/`);
    expect(response.status).to.equal(StatusCodes.OK);

    const expectedData = {
      name: 'README.md',
      path: 'README.md',
      sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0'
    };

    const readme = response.data.find(
      (contents) => contents.name === 'README.md'
    );

    user.repository.readme.download_url = readme.download_url;

    expect(readme).to.containSubset(expectedData);
  });

  it('Consume GET service to save readme from repository', async () => {
    const response = await axios.get(user.repository.readme.download_url);
    expect(response.status).to.equal(StatusCodes.OK);

    const dataMd5 = md5(response.data);
    expect(md5(response.data)).to.equal(dataMd5);
  });
});
