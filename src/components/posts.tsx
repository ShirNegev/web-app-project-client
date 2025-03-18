import React, { useState, useEffect, useRef } from "react";
import PostComponent from "./post";
import Post, { PostSubmition } from "../interfaces/Post";
import { useUserStore } from "../store/useUserStore";
import Comment from "../interfaces/Comment";

import {
  getAllPosts,
  createPost,
  uploadImage,
  likePost,
  unlikePost,
  deletePost,
  editPost,
  getConnectedUserPosts
} from "../services/post-service";

import {generatePostUsingAi} from "../services/ai-service";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const { user } = useUserStore();
  const [showMyPosts, setShowMyPosts] = useState(false);

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchAllPosts = async (page: number) => {
    try {
      const data = await getAllPosts(page);
      if (page === 1)
        setPosts(data.posts)
      else
        setPosts(prevPosts => [...prevPosts, ...data.posts]);

      setMaxPage(data.maxPage);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts(page);
  }, [page]);

  const fetchMyPosts = async () => {
    try {
      const data = await getConnectedUserPosts();
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const togglePostsAndMyPosts = () => {
    if (showMyPosts) {
      setPage(1)
      fetchAllPosts(1);
    } else {
      fetchMyPosts();
    }

    setShowMyPosts(!showMyPosts);
  }

  const addPost = () => {
    console.log(newPostText.trim())
    console.log(newPostFile)
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
          createdPost.likes = 0;
          createdPost.isLiked = false;

          setPosts([createdPost, ...posts]);
          setNewPostText("");

          setNewPostFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input value
          }
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGenerateAiPost = async () => {
    if (!aiPrompt.trim()) return;

    try {
      const aiPost = await generatePostUsingAi(aiPrompt);
      setNewPostText(aiPost);
      setAiPrompt("");
      console.log("AI Generated Post:", aiPost);
    } catch (error) {
      console.error("Error generating AI post:", error);
    }
  };

  const onLike = async (id: string) => {
    if (posts.find(post => post._id === id)?.isLiked === false) {
      await likePost(id);
      const updatedPosts = posts.map((post) => {
        if (post._id === id) {
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
        if (post._id === id) {
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
    setPosts(posts.filter(post => post._id !== id));
  }

  const onAddComment = (postId: string, comment: Comment) => {
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  }

  const onUpdate = (id: string, newText: string, image: File | null, postImage: string) => {
    if (!newText.trim()) return;

    if (image !== null) {
      const { request } = uploadImage(image);

      request
        .then((response) => {
          const post: PostSubmition = {
            text: newText,
            image: response.data.url,
          };
  
          editPost(id, post)
          .then(() => {
            setPosts(posts.map(post => post._id === id ? { ...post, text: newText, image: response.data.url} : post));
          })
          .catch((error) => {
            console.error("Error creating post:", error);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const post: PostSubmition = {
        text: newText,
        image: postImage,
      };

      editPost(id, post)
      .then(() => {
        setPosts(posts.map(post => post._id === id ? { ...post, text: newText, image: postImage} : post));
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
    }
  }

  return (
    <div className="container d-flex flex-column" style={{ width: "100%" }}>
      <div className="row">
          <div className="card p-3 mb-4">
            <h5>Create a New Post</h5>
            {/* Input and Button in the same line using Flexbox */}
            <div className="d-flex">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="What's on your plate today?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <button className="btn btn-primary mb-2" onClick={() => setShowAiModal(true)}>
              Generate AI Post
            </button>
          </div>
            <input type="file" className="form-control mb-2" accept="image/*" ref={fileInputRef} onChange={(e) => setNewPostFile(e.target.files ? e.target.files[0] : null)} />
            {<button className="btn btn-primary" onClick={addPost}>Post</button>}
          </div>
          <button className="btn btn-secondary mb-3" onClick={()=> {togglePostsAndMyPosts();}}>
            {showMyPosts ? "Show All Posts" : "Show My Posts"}
          </button>
          {user && posts.map(post => (
            <PostComponent key={post._id} post={post} currentUser={user.email} onLike={onLike} onDelete={onDelete} onUpdate={onUpdate} onAddComment={onAddComment}></PostComponent>
          ))}
          {!showMyPosts && (page < maxPage) && <button className="btn btn-secondary mb-3" onClick={() => setPage(page + 1)}>
            Load More Posts
          </button>}

          {/* AI Post Modal */}
          {showAiModal && (
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="aiPostModalLabel">Generate AI Post</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAiModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Generate me a recipe for a tasty burger"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAiModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={()=> {handleGenerateAiPost(); if (aiPrompt.trim()) setShowAiModal(false);}}>
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}        
        </div>
    </div>
  );
};

export default Posts;