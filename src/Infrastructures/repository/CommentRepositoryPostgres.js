const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, FALSE ,$5) RETURNING id, content, owner, thread',
      values: [id, thread, content, owner, new Date().toISOString()],
    };

    const result = await this._pool.query(query);

    return new RegisteredComment(result.rows[0]);
  }

  async getCommentsByThread(thread) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.created_at as date, comments.content, comments.is_deleted FROM comments LEFT JOIN users ON users.id = comments.owner WHERE thread = $1 ORDER BY comments.created_at ASC',
      values: [thread],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  };

  async getCommentsById(comment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
    const { rows } = result;
    return rows;
  }
  async verifyOwner(comment, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 and owner = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('anda bukan owner.');
    }
  }

  async deleteComment(comment) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [comment],
    };

    await this._pool.query(query);
  }

}

module.exports = CommentRepositoryPostgres;