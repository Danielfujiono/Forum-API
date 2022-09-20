const DetailComment = require('../DetailComment');

describe('a Detail Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new DetailComment({})).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should remap comments data correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-123123123',
          username: 'userr',
          date: '2022-09-16T07:10:48.232Z',
          content: 'comment1',
          is_deleted: true,
        },
        {
          id: 'comment-456456456',
          username: 'dicoding',
          date: '2022-09-16T07:10:49.232Z',
          content: 'comment2',
          is_deleted: false,
        },
      ],
    };

    const { comments } = new DetailComment(payload);

    const expectedComment = [
        {
          id: 'comment-123123123',
          username: 'userr',
          date: '2022-09-16T07:10:48.232Z',
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-456456456',
          username: 'dicoding',
          date: '2022-09-16T07:10:49.232Z',
          content: 'comment2',
        },
    ];

    expect(comments).toEqual(expectedComment);
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-123123123',
          username: 'userr',
          date: '2022-09-16T07:10:48.232Z',
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-456456456',
          username: 'dicoding',
          date: '2022-09-16T07:10:49.232Z',
          content: 'comment2',
        },
      ],
    };

    const { comments } = new DetailComment(payload);

    expect(comments).toEqual(payload.comments);
  });
});
