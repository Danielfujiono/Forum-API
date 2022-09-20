const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDataUseCase = require('../GetThreadDataUseCase');

describe('GetThreadDataUseCase', () => {
  it('should get return detail thread correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      username: 'dicoding',
      date: '2022-09-16',
      body: 'bodyy',
      title: 'threadd',
    };

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-09-16',
        content: 'comment1',
        is_deleted: true,
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-09-16',
        content: 'comment2',
        is_deleted: false,
      },
    ];
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    const detailThreadUseCase = new GetThreadDataUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.checkThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getCommentsByThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(detailThread).toStrictEqual({
      thread: {
        id: 'thread-123',
        username: 'dicoding',
        date: '2022-09-16',
        body: 'bodyy',
        title: 'threadd',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-09-16',
            content: '**komentar telah dihapus**',
          },
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-09-16',
            content: 'comment2',
          },
        ],
      },
    });
  });
});
