const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const timekeeper = require('timekeeper');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // Dummy dependency
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
  });

  describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      timekeeper.reset();
      await pool.end();
    });

    beforeAll(() => {
      // Lock Time
      timekeeper.freeze(new Date('2022-09-18'));
    });

    describe('addComment function', () => {
      it('should persist new comment and return added comment correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'body', owner: 'user-123' });
        const newComment = new RegisterComment({
          content: 'comment',
          thread: 'thread-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
        const registeredComment = await commentRepositoryPostgres.addComment(newComment);
        expect(registeredComment.owner).toEqual(newComment.owner);
        expect(registeredComment.content).toEqual(newComment.content);
        expect(registeredComment).toStrictEqual(new RegisteredComment({
          id: 'comment-123',
          content: 'comment',
          owner: 'user-123'
        }));
        
        // cek data tersimpan di database
        const comments = await CommentsTableTestHelper.getCommentsById(registeredComment.id);
        expect(Array.isArray(comments)).toBe(true);
        expect(comments[0].id).toEqual(registeredComment.id);
        expect(comments[0].username).toEqual(registeredComment.username);
        expect(comments[0].content).toEqual(newComment.content);
      });

    });

    describe('verifyOwner function', () => {
      it('should throw AuthorizationError if comment not belong to owner', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await UsersTableTestHelper.addUser({ id: 'user-1234', username: 'dicodinggggg' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123', content: 'comment', thread: 'thread-123', owner: 'user-123',
        });
        await expect(commentRepositoryPostgres.verifyOwner('comment-123', 'user-1234'))
          .rejects.toThrow(AuthorizationError);
      });

      it('should not throw AuthorizationError if comment is belongs to owner', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123', content: 'comment', thread: 'thread-123', owner: 'user-123',
        });
        await expect(commentRepositoryPostgres.verifyOwner('comment-123', 'user-123'))
          .resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('getCommentsThread', () => {
      it('should get comments', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-123', username: 'dicoding' };
        const threadPayload = {
          id: 'thread-123',
          title: 'title',
          body: 'body',
          owner: 'user-123',
        };
        const commentPayload = {
          id: 'comment-123',
          content: 'comment',
          thread: threadPayload.id,
          owner: userPayload.id,
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment(commentPayload);
        const comments = await commentRepositoryPostgres.getCommentsByThread(threadPayload.id);

        expect(Array.isArray(comments)).toBe(true);
        expect(comments[0].id).toEqual(commentPayload.id);
        expect(comments[0].username).toEqual(userPayload.username);
        expect(comments[0].content).toEqual('comment');
        // untuk date tolong diberi contoh di deskripsi untuk validasi yang baik selain tobedefined apabila timekeeper kurang oke
        expect(comments[0].date).toEqual(new Date().toISOString());
      });

    });

    describe('get comment by comment id', () => {

      it('should get comment by id', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-123', username: 'dicoding' };
        const threadPayload = {
          id: 'thread-123',
          title: 'title',
          body: 'body',
          owner: 'user-123',
        };
        const commentPayload = {
          id: 'comment-123',
          content: 'comment',
          thread: threadPayload.id,
          owner: userPayload.id,
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment(commentPayload);
        const comments = await commentRepositoryPostgres.getCommentsById(commentPayload.id);
        expect(comments[0].id).toEqual(commentPayload.id);
        expect(comments[0].content).toEqual('comment');
        expect(comments[0].owner).toEqual(commentPayload.owner);
        // untuk date tolong diberi contoh di deskripsi untuk validasi yang baik selain tobedefined apabila timekeeper kurang oke
        expect(comments[0].created_at).toEqual(new Date().toISOString());
      });

      it('should not get comment by id', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-123', username: 'dicoding' };
        const threadPayload = {
          id: 'thread-123',
          title: 'title',
          body: 'body',
          owner: 'user-123',
        };
        const commentPayload = {
          id: 'comment-123',
          content: 'comment',
          thread: threadPayload.id,
          owner: userPayload.id,
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment(commentPayload);
        await expect(commentRepositoryPostgres.getCommentsById('asdasdasd'))
          .rejects.toThrow(NotFoundError);
      });
    });

    describe('deleteComment', () => {
      it('should delete comment from database', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123', content: 'body', thread: 'thread-123', owner: 'user-123',
        });

        // Action
        await commentRepositoryPostgres.deleteComment('comment-123');

        // Assert
        const comment = await CommentsTableTestHelper.getCommentsById('comment-123');
        expect(comment[0].is_deleted).toEqual(true);
      });
    });
  });

});
