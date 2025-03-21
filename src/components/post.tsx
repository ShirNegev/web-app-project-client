import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Post from '../interfaces/Post';
import Comment, { CommentSubmition } from '../interfaces/Comment';
import { getPostById } from '../services/post-service';
import { createComment } from '../services/comment-service';
import moment from 'moment';

const PostComponent: React.FC<{
  post: Post;
  currentUser: string | undefined;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onUpdate: (id: string, newText: string, image: File | null, postImage: string) => void;
  onAddComment: (postId: string, comment: Comment) => void;
}> = ({ post, currentUser, onDelete, onLike, onUpdate, onAddComment }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostFile, setNewPostFile] = useState<File | null>(null);

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    setIsLoading(true);

    const comment: CommentSubmition = {
      text: newComment,
      postId: postId,
    };

    createComment(comment)
      .then((comment) => {
        setPostComments([...postComments, comment]);
        onAddComment(post._id, comment);
        setNewComment('');
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error', error);
        setIsLoading(false);
      });
  };

  const getCommentsByPostId = async (postId: string) => {
    setIsLoading(true);

    getPostById(postId)
      .then((post) => {
        setPostComments(post.comments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error', error);
        setIsLoading(false);
      });
  };

  const isLiked = () => {
    return post.isLiked;
  };

  return (
    <div className="card mb-3 p-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            src={post.author.imageUrl}
            alt="User"
            className="rounded-circle me-2"
            width="40"
            height="40"
            style={{ objectFit: 'cover' }}
          />
          <div>
            <strong>{post.author.fullName}</strong>
            <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
              {moment(post.timestamp).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>
        </div>
        {post.author.email === currentUser && (
          <div className="flex-shrink-0 dropdown">
            <div data-bs-toggle="dropdown" role="button" className="me-2">
              <i className="bi bi-three-dots"></i>
            </div>
            <ul className="dropdown-menu shadow">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowEditModal(true);
                    setNewPostText(post.text);
                  }}
                >
                  Edit
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={() => onDelete(post._id)}>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <img src={post.image} alt="Post" className="img-fluid mb-1" />
      <div className="card-body px-4">
        <p className="text-center fw-medium">{post.text}</p>
        <div className="">
          <hr className="hr" />
          <div>
            <button
              className="btn btn-outline-secondary fs-5 me-2"
              onClick={() => onLike(post._id)}
            >
              {' '}
              {isLiked() ? (
                <i className="bi bi-heart-fill text-danger"></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}{' '}
              {post.likes}{' '}
            </button>
            <button
              className="btn btn-outline-secondary fs-5"
              onClick={() => {
                setShowModal(true);
                getCommentsByPostId(post._id);
              }}
            >
              <i className="bi bi-chat"></i> {post.comments.length}
            </button>
          </div>
        </div>
      </div>

      {/* show edit modal*/}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => setNewPostFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowEditModal(false);
                    onUpdate(post._id, newPostText, newPostFile, post.image);
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* show full post details*/}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <img
                    src={post.author.imageUrl}
                    alt="User"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <strong>{post.author.fullName}</strong>
                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                      {moment(post.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <img src={post.image} alt="Post" className="img-fluid mb-2" />
                <p className=' text-center'>{post.text}</p>
                <button
                  className="btn btn-outline-secondary fs-5 me-2"
                  onClick={() => onLike(post._id)}
                >
                  {' '}
                  {isLiked() ? (
                    <i className="bi bi-heart-fill text-danger"></i>
                  ) : (
                    <i className="bi bi-heart"></i>
                  )}{' '}
                  {post.likes}{' '}
                </button>
                <h6 className="mt-3">Comments</h6>
                {isLoading && <p>Loading comments...</p>}
                {!isLoading && postComments.length === 0 && <p>No comments yet!</p>}
                {postComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="d-flex card px-2 rounded mb-2 row g-0"
                  >
                    <div className="d-flex align-items-center mt-2">
                      <img
                        src={comment.author.imageUrl}
                        alt="User"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <strong>{comment.author.fullName}</strong>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                          {moment(comment.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 mb-0 mt-1">
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))}
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => handleAddComment(post._id)}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
