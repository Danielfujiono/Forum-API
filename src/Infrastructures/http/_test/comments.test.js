const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });



  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        content: 'commentt',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicodingggggg',
        },
      });
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuthentication = JSON.parse(responseAuth.payload);


      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'comment'
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
      };
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicodingggggg',
        },
      });
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuthentication = JSON.parse(responseAuth.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });
  });
  describe('when GET /threads/{threadId}', () => {
    it('should response 200', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = await createServer(container);

      content: 'commentt',
        // Action
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'dicodingggggg',
          },
        });
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuthentication = JSON.parse(responseAuth.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'comment'
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      const threads = JSON.parse(response.payload);
      const commentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${threads.data.addedComment.id}`,
        payload: {
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(commentResponse.payload);
      expect(responseJson.status).toEqual('success');
    });
  });
  describe('when DELETE /threads/{threadId}/comments/{commentsId}', () => {
    it('should response 200', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = await createServer(container);

      content: 'commentt',
        // Action
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'dicodingggggg',
          },
        });
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuthentication = JSON.parse(responseAuth.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'comment'
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      const threads = JSON.parse(response.payload);
      const commentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${threads.data.addedComment.id}`,
        payload: {
        },
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(commentResponse.payload);
      expect(responseJson.status).toEqual('success');
    });
  });
});