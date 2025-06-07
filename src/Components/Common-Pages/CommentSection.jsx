import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getUserDetails } from "../../utils/userDetails";
import "../../Assets/Styles/CommentSection.css";

function CommentSection({ postId, postAuthorId  }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { userId, username } = getUserDetails();
  const admin= sessionStorage.getItem("isAdminLoggedIn")


  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/comment/get-comments/${postId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setComments(res.data.data);
        } else {
          Swal.fire("Error", res.data.msg || "Failed to load comments", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load comments", "error");
      })
      .finally(() => setLoading(false));
  }, [postId]);

  function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) {
      Swal.fire("Warning", "Comment cannot be empty", "warning");
      return;
    }
    if (!userId || !username) {
      Swal.fire("Error", "You must be logged in to comment", "error");
      return;
    }

    const commentData = {
      postId,
      userId,
      commentText: newComment.trim(),
    };

    axios
      .post(`${API_BASE_URL}/comment/add-comment`, commentData)
      .then((res) => {
        if (res.data.status === 200) {
          setComments([...comments, res.data.data]);
          setNewComment("");
          Swal.fire("Success", "Comment added successfully", "success");
        } else {
          Swal.fire("Error", res.data.msg || "Failed to add comment", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Failed to add comment", "error");
      });
  }

  function handleDeleteComment(commentId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this comment deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/comment/delete/${commentId}`)
          .then((res) => {
            if (res.data.status === 200) {
              setComments(comments.filter((c) => c._id !== commentId));
              Swal.fire("Deleted!", "Comment has been deleted.", "success");
            } else {
              Swal.fire("Error", res.data.msg || "Failed to delete comment", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error", "Failed to delete comment", "error");
          });
      }
    });
  }

  return (
    <div className="comment-gradient-wrapper">
      <div className="comment-gradient-container">
        <h3 className="comment-gradient-title">Leave a Comment</h3>

        <form onSubmit={handleAddComment} className="comment-gradient-form">
          <textarea
            className="comment-gradient-input"
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
          />
          <button type="submit" className="comment-gradient-submit">
            Post
          </button>
        </form>

        {loading ? (
          <p className="comment-gradient-loading">Loading comments...</p>
        ) : (
          <ul className="comment-gradient-list">
            {comments.length === 0 ? (
              <p className="comment-gradient-empty">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <li key={comment._id} className="comment-gradient-item">
                  <div className="comment-gradient-avatar">
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                  <hr/>
                  <div className="comment-gradient-content">
                    <div className="comment-gradient-header">
                      <span className="comment-gradient-username">{comment.username}</span>
                      {userId === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="comment-gradient-delete"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="comment-text">{comment.commentText}</div>
                      <div className="comment-meta">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CommentSection;