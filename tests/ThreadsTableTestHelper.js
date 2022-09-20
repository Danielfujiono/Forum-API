const pool = require('../src/Infrastructures/database/postgres/pool');
 
const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'title', body = 'body', owner = 'user-123', date = new Date().toISOString()
  }) {

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    };
 
    await pool.query(query);
  },
 
  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
 
    const result = await pool.query(query);
    return result.rows;
  },
 
  async getDetailThread(threadId) {
    const query = {
      text: 'SELECT threads.id, title, owner, body, created_at as date, username FROM threads JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads');
  },
};
 
module.exports = ThreadsTableTestHelper;