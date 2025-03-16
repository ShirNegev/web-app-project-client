interface Comment {
  id: string;
  text: string;
  author: {
    fullName: string;
    imageUrl: string;
  };
  timestamp: Date;
  postId: string;
}

export default Comment;