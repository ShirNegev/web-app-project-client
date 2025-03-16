export interface PostSubmition {
  text: string;
  image: string;
}

export interface Post extends PostSubmition {
  _id: string;
  timestamp: Date;
  author: {
    fullName: string;
    email: string;
    imageUrl: string;
  };
  comments: [Comment];
  likes: number;
  isLiked: boolean;
}

export interface PostWithPagination {
  posts: [Post];
  currentPage: number;
}

export default Post;