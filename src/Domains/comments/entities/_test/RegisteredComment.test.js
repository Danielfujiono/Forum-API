const RegisteredComment = require('../RegisteredComment');
 
describe('a RegisteredComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
    };
 
    // Action and Assert
    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
 
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
      thread: 'thread-123',
      owner: 'owner-123'
    };
 
    // Action and Assert
    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
 
  it('should create registeredComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ceomentttt',
      thread: 'thread-123',
      owner: 'user-123'
    };
 
    // Action
    const registeredComment = new RegisteredComment(payload);
 
    // Assert
    expect(registeredComment.id).toEqual(payload.id);
    expect(registeredComment.owner).toEqual(payload.owner);
    expect(registeredComment.content).toEqual(payload.content);
  });
});