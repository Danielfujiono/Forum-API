const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });



  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'dicoding',
        body: 'body',
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


      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'dicoding',
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });


    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'dicoding',
        body: ['body'],
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads', () => {
    it('should response 201 and thread data', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'dicoding',
        body: 'body',
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


      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadResponseJson.data.addedThread.id}`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthentication.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

  });

});