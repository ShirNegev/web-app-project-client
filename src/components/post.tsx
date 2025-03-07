import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Post from "../interfaces/Post";
import Comment from "../interfaces/Comment";

const comments: Comment[] = [{id: 2, user: 'Eran', userImage: 'https://foodish-api.com/images/pizza/pizza85.jpg', text: 'Looks amazing!', timestamp: '1 hour ago'}, {id: 3, user: 'Shir', userImage: 'https://foodish-api.com/images/pizza/pizza85.jpg', text: 'I need this recipe!', timestamp: '1 hour ago'}];

const PostComponent: React.FC<{ post: Post; currentUser: string; onDelete: (id: number) => void; onLike: (id: number) => void; onUpdate: (id: number, newText: string, image: string) => void;}> = ({ post, currentUser, onDelete, onLike, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostFile, setNewPostFile] = useState<File | null>(null);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      user: currentUser,
      userImage: "https://via.placeholder.com/50",
      text: newComment,
      timestamp: new Date().toLocaleString()
    };
    setPostComments([...postComments, comment]);
    setNewComment("");
  };

  const handleDeleteComment = (commentId: number) => {
    setPostComments(postComments.filter(comment => comment.id !== commentId));
  };

  const getCommentsByPostId = () => {
    if (post.comments.length === 0 || postComments.length !== 0) return;

    setIsLoading(true);
    getCommentsWithDelay(post.id).then((comments) => {
      setPostComments(comments);
      setIsLoading(false);
    } ).catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
  }

  const getCommentsWithDelay = async (postId: number): Promise<Comment[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(comments);
        }, 2000);
    });
  }

  const isLiked = () => {return post.likes.includes(currentUser)};

  return (
    <div className="card mb-3 p-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={post.userImage} alt="User" className="rounded-circle me-2" width="40" height="40" />
          <div>
            <strong>{post.user}</strong>
            <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{post.timestamp}</p>
          </div>
        </div>
        {post.user === currentUser && (
            <div>
          <button className="btn btn-outline-dark btn-sm me-2" onClick={() => {setShowEditModal(true); setNewPostText(post.text);}}><i className="bi bi-pen"></i></button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(post.id)}><i className="bi bi-trash3"></i></button>
          </div>
        )}
      </div>
      <div className="card-body text-center">
        <img src={post.image} alt="Post" className="img-fluid mb-2" />
        <p>{post.text}</p>
      </div>
      <div className="card-footer d-flex bg-white">
        <button className={`btn me-3 ${isLiked() ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onLike(post.id)}>
          👍 {post.likes.length}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => {setShowModal(true); getCommentsByPostId();}}>
          💬 {post.comments.length}
        </button>
      </div>
      
      {/* show edit modal*/}
        {showEditModal && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Post</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                    <input type="text" className="form-control mb-2" value={newPostText} onChange={(e) => setNewPostText(e.target.value)} />
                    <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => setNewPostFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowEditModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={() => {setShowEditModal(false); onUpdate(post.id, newPostText, newPostFile ? URL.createObjectURL(newPostFile) : "");}}>Save changes</button>
                </div>
                </div>
            </div>
            </div>
        )}

      {/* show full post details*/}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <img src={post.userImage} alt="User" className="rounded-circle me-2" width="40" height="40" />
                  <div>
                    <strong>{post.user}</strong>
                    <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{post.timestamp}</p>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <img src={post.image} alt="Post" className="img-fluid mb-2" />
                <p>{post.text}</p>
                <button className={`btn ${isLiked() ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onLike(post.id)}>
                  👍 {post.likes.length}
                </button>
                <h6 className="mt-3">Comments</h6>
                {isLoading && <p>Loading comments...</p>}
                {!isLoading && postComments.length === 0 && <p>No comments yet!</p>}
                {postComments.map((comment) => (
                  <div key={comment.id} className="d-flex align-items-center border p-2 rounded mb-2">
                    <img src={comment.userImage} alt="User" className="rounded-circle me-2" width="30" height="30" />
                    <div>
                      <strong>{comment.user}</strong>
                      <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{comment.timestamp}</p>
                      <p>{comment.text}</p>
                    </div>
                    {comment.user === currentUser && (
                      <button className="btn btn-sm btn-danger ms-auto" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    )}
                  </div>
                ))}
                <input type="text" className="form-control mt-2" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <button className="btn btn-sm btn-success mt-2" onClick={handleAddComment}>Add Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComponent;