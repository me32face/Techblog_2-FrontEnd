import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Assets/Styles/ManagePosts.css";
import AdminNavbar from "../ADMIN/AdminNavbar";
import Swal from 'sweetalert2';
import { useNavigate, Link } from "react-router-dom";

function ManagePosts() {
  const isAdmin = sessionStorage.getItem("isAdminLoggedIn");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      Swal.fire({
        title: 'Restricted!',
        text: 'If you are an Admin, please login',
        icon: 'error',
        timerProgressBar: true,
        showConfirmButton: true
      });
      navigate("/AdminLogin");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/AllPosts`)
      .then(res => setPosts(res.data.data))
      .catch(err => console.error("Error fetching posts", err));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This post will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/DeletePost/${id}`)
          .then(() => {
            setPosts(posts.filter((post) => post._id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Post has been deleted.',
              icon: 'success',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error('Error deleting post:', error);
            Swal.fire('Error', 'Failed to delete the post.', 'error');
          });
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fetchComments = (postId) => {
    axios
      .get(`${API_BASE_URL}/comment/get-comments/${postId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setComments(res.data.data);
        } else {
          setComments([]);
        }
      })
      .catch(() => {
        setComments([]);
      });
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    fetchComments(post._id);
  };

  return (
    <div className="admin-posts-wrapper">
      <AdminNavbar />
      <div className="admin-posts-container">
        <h1 className="admin-posts-title">Post Management</h1>

        {selectedPost ? (
          <div className="admin-post-details-panel">
            <button
              className="admin-back-button"
              onClick={() => {
                setSelectedPost(null);
                setComments([]);
              }}
            >
              ⬅ Back to All Posts
            </button>

            <div className="admin-post-card-expanded">
              <h2 className="admin-expanded-title">{selectedPost.title}</h2>

              <div className="admin-meta-info">
                <span>
                  <strong>Author:</strong>{" "}
                  {selectedPost.userDetails ? (
                    <Link
                      to={`/author/${selectedPost.userDetails._id}`}
                      className="admin-author-link"
                    >
                      @{selectedPost.userDetails.username}
                    </Link>
                  ) : (
                    <span className="admin-author-link text-muted">Unknown</span>
                  )}
                </span>
                <span className="admin-post-date"> | {formatDate(selectedPost.datePosted)}</span>
              </div>

              <div className="admin-expanded-image">
                <img
                  src={selectedPost.image || "https://via.placeholder.com/600x500"}
                  alt="Post Banner"
                  className="admin-post-image"
                />
              </div>

              <div className="admin-post-content">
                {selectedPost.content?.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="admin-category-tags">
                <span className="admin-tag">{selectedPost.category}</span>
                {selectedPost.hashtags && (
                  <span className="admin-tag">#{selectedPost.hashtags}</span>
                )}
              </div>

              <button
                className="admin-back-button"
                onClick={() => {
                  setSelectedPost(null);
                  setComments([]);
                }}
              >
                ⬅ Back to All Posts
              </button>

              <div className="admin-comments-section">
                <h5>💬 Comments</h5>
                {comments.length === 0 ? (
                  <p>No comments on this post.</p>
                ) : (
                  <ul className="admin-comments-list">
                    {comments.map((comment) => (
                      <li key={comment._id} className="admin-comment-item">
                        <strong>{comment.username}</strong>
                        <span>{comment.commentText}</span>
                        <div className="admin-comment-time">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-posts-grid">
            {posts.slice().reverse().map((post) => (
              <div className="admin-post-card" key={post._id}>
                <h3 className="admin-post-title">{post.title}</h3>
                <p className="admin-post-meta">
                  Author: @{post.userDetails?.username || "Unknown"}
                </p>
              <p className="admin-post-meta">Category: {post.category}</p>
                <div className="admin-post-actions">
                  <button
                    className="admin-view-button"
                    onClick={() => handleViewPost(post)}
                  >
                    View
                  </button>
                  <button
                    className="admin-delete-button"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePosts;
