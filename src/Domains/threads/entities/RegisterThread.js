class RegisterThread {
  constructor({ title, owner, body }) {
    if (!title || !owner || !body) {
      throw new Error('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
 
    if (typeof title !== 'string' || typeof owner !== 'string' || typeof body !== 'string') {
      throw new Error('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    
    this.title = title;
    this.owner = owner;
    this.body = body;
  }
}
 
module.exports = RegisterThread;