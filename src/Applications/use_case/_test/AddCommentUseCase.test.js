const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'owner-123',
      content: 'comment1',
      thread: 'thread-123'
    };
    const expectedRegisteredComment = new RegisteredComment({
      id: 'comment-123',
      content: 'comment1',
      owner: 'owner-123',
      thread: 'thread-123'
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    // mockCommentRepository.addComment = jest.fn()
    //   .mockImplementation((comment) => {
    //     if (comment.content === 'comment1') {
    //       return comment;
    //     }
    //     return Promise.reject('failed');
    //   });
      mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredComment({
        id: 'comment-123',
        content: 'comment1',
        owner: 'owner-123',
        thread: 'thread-123'
      })));
    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    // Action
    const registeredComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalled();
    expect(mockThreadRepository.checkThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalled();
    expect(mockCommentRepository.addComment).toBeCalledWith(new RegisterComment({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      thread: useCasePayload.thread
    }));
    // tolong berikan penjelasan apa best case pembuatan expect dari registeredComment dibawah ini apabila yang dibawah ini masih bisa dikembangkan
    // terima kasih
    expect(registeredComment).toBeDefined();
    expect(registeredComment).toStrictEqual(expectedRegisteredComment);
  });
});