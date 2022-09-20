/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', thread = 'thread-123', content = 'content1', owner = 'user-123', is_deleted = false
  }) {

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, thread, content, owner, is_deleted, new Date().toISOString()],
    };

    await pool.query(query);
  },

  async findCommentsByThreadId(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE thread = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };
    await pool.query(query);
  },

  async getCommentsById(comment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [comment],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments');
  },
};

module.exports = CommentsTableTestHelper;