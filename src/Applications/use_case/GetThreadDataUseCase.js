const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetThreadDataUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { thread } = new DetailThread(useCasePayload);
        await this._threadRepository.checkThread(thread);
        const detailThread = await this._threadRepository.getDetailThread(thread);
        const getCommentsThread = await this._commentRepository.getCommentsByThread(thread);
        detailThread.comments = new DetailComment({ comments: getCommentsThread }).comments;
        return {
          thread: detailThread,
        };
    }
}

module.exports = GetThreadDataUseCase;