const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const instance = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});

const urlBase = 'https://api.github.com';

const user = {
  login: '',
  repositories: {
    repos_url: '',
    public_repository: {
      issue: {}
    }
  }
};

describe('Github Post and Patch Test', () => {
  it('Obtain User logging', async () => {
    const response = await instance.get(`${urlBase}/user`);
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data.public_repos).to.be.greaterThan(0);
    user.repositories.repos_url = response.data.repos_url;
    user.login = response.data.login;
  });

  it('Get a public repository', async () => {
    const response = await instance.get(user.repositories.repos_url);
    expect(response.status).to.equal(StatusCodes.OK);

    const repository = response.data.find((repo) => repo.private === false);
    user.repositories.public_repository.url = repository.url;
  });

  it('Verify that the repository exists', async () => {
    const response = await instance.get(
      user.repositories.public_repository.url
    );
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data).to.be.not.empty;
    user.repositories.public_repository.name = response.data.name;
  });

  it('Consume the POST service by creating an issue', async () => {
    const issue = {
      title: 'Title_issue'
    };

    const response = await instance.post(
      `https://api.github.com/repos/${user.login}/${user.repositories.public_repository.name}/issues`,
      issue
    );
    expect(response.status).to.equal(StatusCodes.CREATED);

    expect(response.data.title).to.be.equal(issue.title);
    expect(response.data.body).to.be.null;
    user.repositories.public_repository.issue.number = response.data.number;
    user.repositories.public_repository.issue.title = response.data.title;
  });

  it('Consume the PATCH service by modifying the issue', async () => {
    const issue = {
      body: 'body_issue'
    };

    const response = await instance.patch(
      `https://api.github.com/repos/${user.login}/${user.repositories.public_repository.name}/issues/${user.repositories.public_repository.issue.number}`,
      issue
    );
    expect(response.status).to.equal(StatusCodes.OK);

    expect(response.data.title).to.be.equal(
      user.repositories.public_repository.issue.title
    );
    expect(response.data.body).to.be.equal(issue.body);
  });
});
