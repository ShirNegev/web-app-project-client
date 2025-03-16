export interface CommentSubmition {
  text: string;
  postId: string;
}

interface Comment extends CommentSubmition{
  id: string;
  author: {
    fullName: string;
    email: string;
    imageUrl: string;
  };
  timestamp: Date;
}

export default Comment;