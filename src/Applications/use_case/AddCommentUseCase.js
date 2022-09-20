const RegisterComment = require('../../Domains/comments/entities/RegisterComment');
 
class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
 
  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    await this._threadRepository.checkThread(thread);
    const registerComment = new RegisterComment(useCasePayload);
    return this._commentRepository.addComment(registerComment);
  }
}
 
module.exports = AddCommentUseCase;