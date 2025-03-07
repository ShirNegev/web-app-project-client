interface Post {
  id: number;
  user: string;
  userImage: string;
  timestamp: string;
  image: string;
  text: string;
  likes: string[];
  comments: string[];
}

export default Post;