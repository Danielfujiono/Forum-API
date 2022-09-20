const ClientError = require("../../../Commons/exceptions/ClientError");

class RegisterComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, thread, owner } = payload;
    this.content = content;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload({ content, thread, owner }) {
    if (!content || !thread || !owner) {
      throw new Error('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof owner !== 'string' || typeof thread !== 'string') {
      throw new Error('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

  }
}
 
module.exports = RegisterComment;