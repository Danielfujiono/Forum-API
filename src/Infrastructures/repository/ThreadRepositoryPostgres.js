const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread) {
    const { title, owner, body } = registerThread;
    const id = `thread-${this._idGenerator()}`;


    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, new Date().toISOString()],
    };

    const result = await this._pool.query(query);

    return new RegisteredThread({ ...result.rows[0] });
  }
  async checkThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getDetailThread(threadId) {
    const query = {
      text: 'SELECT threads.id, title, body, created_at as date, username FROM threads JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;