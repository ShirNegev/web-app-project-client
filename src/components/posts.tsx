import React, { useState, useEffect } from "react";
import PostComponent from "./post";
import Post from "../interfaces/Post";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostFile, setNewPostFile] = useState<File | null>(null);

  useEffect(() => {
    setPosts([
      {
        id: 1,
        user: "Shir",
        userImage: "https://foodish-api.com/images/pizza/pizza85.jpg",
        timestamp: "2 hours ago",
        image: "https://foodish-api.com/images/pizza/pizza85.jpg",
        text: "Delicious homemade pizza! 🍕",
        likes: ["Shir", "Eran", "Yael", "Yotam", "Lior"],
        comments: ["Shir", "Eran"]
      }
    ]);
  }, []);

  const addPost = () => {
    if (!newPostText.trim()) return;
    const imageUrl = newPostFile ? URL.createObjectURL(newPostFile) : newPostImage || "https://via.placeholder.com/150";
    const newPost: Post = {
      id: posts.length + 1,
      user: "Shir",
      userImage: "https://foodish-api.com/images/pizza/pizza85.jpg",
      timestamp: "now",
      image: imageUrl,
      text: newPostText,
      likes: [],
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImage("");
    setNewPostFile(null);
  };

  const onLike = (id: number) => {
    if(posts.find(post => post.id === id)?.likes.includes("Shir")) {
      setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes.filter(user => user !== "Shir") } : post));
    }
    else {
        setPosts(posts.map(post => post.id === id ? { ...post, likes: [...post.likes, "Shir"] } : post));
        }
  }

  const onDelete = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    }

    const onUpdate = (id: number, newText: string, image: string) => {
        if (image === "") {
            setPosts(posts.map(post => post.id === id ? { ...post, text: newText } : post));
        } 
        else {
        setPosts(posts.map(post => post.id === id ? { ...post, text: newText, image:  image} : post));
        }
    }

  return (
    <div className="container d-flex flex-column" style={{ width: "60%" }}>
      <div className="row">
          <div className="card p-3 mb-4">
            <h5>Create a New Post</h5>
            <input type="text" className="form-control mb-2" placeholder="What's on your plate today?" value={newPostText} onChange={(e) => setNewPostText(e.target.value)} />
            <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => setNewPostFile(e.target.files ? e.target.files[0] : null)} />
            <button className="btn btn-primary" onClick={addPost}>Post</button>
          </div>
          {posts.map(post => (
            <PostComponent post={post} currentUser="Shir" onLike={onLike} onDelete={onDelete} onUpdate={onUpdate}></PostComponent>
          ))}
          </div>
    </div>
  );
};

export default Posts;