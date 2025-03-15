import React, { useState, useEffect } from "react";
import PostComponent from "./post";
import Post, { PostSubmition } from "../interfaces/Post";

import {
  getAllPosts,
  createPost,
  uploadImage,
  likePost,
  unlikePost,
  deletePost
} from "../services/post-service";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostFile, setNewPostFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);
        console.log(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const addPost = () => {
    if (!newPostText.trim() || newPostFile == null) return;

    const { request } = uploadImage(newPostFile);

    request
      .then((response) => {
        const post: PostSubmition = {
          text: newPostText,
          image: response.data.url,
        };

        createPost(post)
        .then((createdPost) => {
          setPosts([createdPost, ...posts]);
          setNewPostText("");
          setNewPostImage("");
          setNewPostFile(null);
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onLike = async (id: string) => {
    if (posts.find(post => post.id === id)?.isLiked === false) {
      await likePost(id);
      const updatedPosts = posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.likes + 1,
            isLiked: true,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } else {
      await unlikePost(id);
      const updatedPosts = posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.likes - 1,
            isLiked: false,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    }
  }

  const onDelete = async (id: string) => {
    await deletePost(id);
    setPosts(posts.filter(post => post.id !== id));
  }

    const onUpdate = (id: string, newText: string, image: string) => {
        // if (image === "") {
        //     setPosts(posts.map(post => post.id === id ? { ...post, text: newText } : post));
        // } 
        // else {
        // setPosts(posts.map(post => post.id === id ? { ...post, text: newText, image:  image} : post));
        // }
    }

  return (
    <div className="container d-flex flex-column" style={{ width: "60%" }}>
      <div className="row">
          <div className="card p-3 mb-4">
            <h5>Create a New Post</h5>
            <input type="text" className="form-control mb-2" placeholder="What's on your plate today?" value={newPostText} onChange={(e) => setNewPostText(e.target.value)} />
            <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => setNewPostFile(e.target.files ? e.target.files[0] : null)} />
            {<button className="btn btn-primary" onClick={addPost}>Post</button>}
          </div>
          {posts.map(post => (
            <PostComponent key={post.id} post={post} currentUser={post.author.fullName} /*TODO: take user full name from state*/ onLike={onLike} onDelete={onDelete} onUpdate={onUpdate}></PostComponent>
          ))}
          </div>
    </div>
  );
};

export default Posts;