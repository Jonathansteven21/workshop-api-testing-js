const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const instance = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});

const user = {
  put: {
    data: {}
  },
  followers: {
    followed: ''
  }
};

const urlBase = 'https://api.github.com';
const githubUserName = 'Jonathansteven21';
const githubUserFollow = 'aperdomob';

describe('Api PUT Tests', () => {
  it('Consume PUT Service', async () => {
    const response = await instance.put(
      `${urlBase}/user/following/${githubUserFollow}`
    );
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);

    expect(response.data).to.be.empty;
    user.put.data = response.data;
  });

  it('Verify follow with GET Service', async () => {
    const response = await axios.get(
      `${urlBase}/users/${githubUserName}/following`
    );
    expect(response.status).to.equal(StatusCodes.OK);

    const githubUserFollowed = response.data.find(
      (follower) => follower.login === githubUserFollow
    );

    user.followers.followed = githubUserFollowed.login;
    expect(githubUserFollowed.login).to.equal(githubUserFollow);
  });

  it('Verify idempotent from follow Service', async () => {
    // PUT
    const responsePut = await instance.put(
      `${urlBase}/user/following/${githubUserFollow}`
    );
    expect(responsePut.status).to.equal(StatusCodes.NO_CONTENT);

    expect(responsePut.data).to.equal(user.put.data);

    // GET
    const responseFollowers = await axios.get(
      `${urlBase}/users/${githubUserName}/following`
    );
    expect(responseFollowers.status).to.equal(StatusCodes.OK);

    const githubUserFollowed = responseFollowers.data.find(
      (follower) => follower.login === githubUserFollow
    );

    expect(githubUserFollowed.login).to.equal(user.followers.followed);
  });
});
