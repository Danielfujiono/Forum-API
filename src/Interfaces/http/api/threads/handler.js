const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDataUseCase = require('../../../../Applications/use_case/GetThreadDataUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const payload = {
      title: request.payload.title,
      body: request.payload.body,
      owner,
    };
    const addedThread = await addThreadUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
  async getDetailThreadHandler(request, h) {
    const getThreadDataUseCase = this._container.getInstance(GetThreadDataUseCase.name);
    const useCasePayload = {
      thread: request.params.threadId,
    };
    const { thread } = await getThreadDataUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;