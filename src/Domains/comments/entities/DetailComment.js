class DetailComment {
    constructor(payload) {
        const comments = this._verifyPayload(payload);
        this.comments = comments;
    }

    _verifyPayload({ comments }) {
        if (!comments) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        return comments.map((comment) => ({
            id: comment.id,
            username: comment.username,
            date: comment.date,
            content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
        }));
    }

}

module.exports = DetailComment;
