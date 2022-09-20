const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const timekeeper = require('timekeeper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeAll(() => {
    // Lock Time
    timekeeper.freeze(new Date('2022-09-18'));
  });
  afterAll(async () => {
    timekeeper.reset();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist register thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'dicoding',
        owner: 'user-123',
        body: 'body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const resultThread = await threadRepositoryPostgres.addThread(registerThread);
      expect(resultThread.id).toStrictEqual('thread-123');
      expect(resultThread.title).toStrictEqual(registerThread.title);
      expect(resultThread.owner).toStrictEqual(registerThread.owner);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById(resultThread.id);
      expect(threads[0].id).toStrictEqual('thread-123');
      expect(threads[0].title).toStrictEqual(registerThread.title);
      expect(threads[0].owner).toStrictEqual(registerThread.owner);
      expect(threads).toHaveLength(1);
    });

  });
  describe('getThread function', () => {
    it('should get detail thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'dicoding',
        owner: 'user-123',
        body: 'body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const result = await threadRepositoryPostgres.addThread(registerThread);
      expect(result.id).toEqual('thread-123');
      expect(result.title).toEqual(registerThread.title);
      expect(result.owner).toEqual(registerThread.owner);

      // Assert
      const threads = await threadRepositoryPostgres.getDetailThread('thread-123');
      expect(threads.id).toEqual('thread-123');
      expect(threads.username).toEqual('dicoding');
      expect(threads.title).toEqual(registerThread.title);
      expect(threads.body).toEqual(registerThread.body);
      expect(threads.date).toEqual(new Date().toISOString());
    });
    it('should not get detail thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'dicoding',
        owner: 'user-123',
        body: 'body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      await expect(threadRepositoryPostgres.getDetailThread('asdasdasd'))
        .rejects.toThrow(NotFoundError);
    });

  });
  describe('check Thread function',  () => {
    
    it('thread should available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'dicoding',
        owner: 'user-123',
        body: 'body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      await expect(threadRepositoryPostgres.checkThread(thread.id)).resolves.not.toThrow(NotFoundError);
    });
    it('thread should not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const registerThread = new RegisterThread({
        title: 'dicoding',
        owner: 'user-123',
        body: 'body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      await expect(threadRepositoryPostgres.checkThread('asdasdasd'))
        .rejects.toThrow(NotFoundError);
    });
  });
});