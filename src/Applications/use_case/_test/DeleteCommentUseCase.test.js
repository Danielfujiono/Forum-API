const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should throw error if use case payload not contain needed data', async () => {
        const useCasePayload = {};
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    });

    it('should throw error if data not string', async () => {
        // Arrange
        const useCasePayload = {
            thread: 'thread-123',
            comment: 123,
            owner: 'user-123',
        };
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        // Action & Assert
        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            thread: 'thread-123',
            comment: 'comment-123',
            owner: 'user-123',
        };
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getCommentsById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });

        // Act
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.checkThread)
            .toHaveBeenCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.getCommentsById)
            .toHaveBeenCalledWith(useCasePayload.comment);
        expect(mockCommentRepository.verifyOwner)
            .toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment)
            .toHaveBeenCalledWith(useCasePayload.comment);
    });
});
