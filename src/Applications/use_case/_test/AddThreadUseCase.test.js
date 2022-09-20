const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
 
describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title1',
      owner: 'user-123',
      body: 'body',
    };
    const expectedRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: 'title1',
      body: 'body',
      owner: 'user-123',
    });
 
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
 
    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
    .mockImplementation(() => Promise.resolve(new RegisteredThread({
      id: 'thread-123',
      title: 'title1',
      body: 'body',
      owner: 'user-123',
    }))); 
 
    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
 
    // Action
    const registeredThread = await getThreadUseCase.execute(useCasePayload);
 
    // Assert
    expect(mockThreadRepository.addThread).toBeCalled();
    expect(mockThreadRepository.addThread).toBeCalledWith(new RegisterThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
    // tolong berikan penjelasan apa best case pembuatan expect dari registeredThread dibawah ini apabila yang dibawah ini masih bisa dikembangkan
    // terima kasih
    expect(registeredThread).toBeDefined();
    expect(registeredThread).toStrictEqual(expectedRegisteredThread);
  });
});