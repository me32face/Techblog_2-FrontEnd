import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Assets/Styles/AdminHome.css";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminHome() {
  const isAdmin = sessionStorage.getItem("isAdminLoggedIn");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isAdmin) {
      Swal.fire({
        title: "Restricted!",
        text: "If you are an Admin, please login",
        icon: "error",
        timerProgressBar: true,
        showConfirmButton: true,
      });
      navigate("/AdminLogin");
    }
  }, [isAdmin, navigate]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [posts, setPosts] = useState(0);
  const [numOfPendingPost, setNumOfPendingPost] = useState(0);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [showPendingListModal, setShowPendingListModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    axios.post(`${API_BASE_URL}/ViewUserData`).then((res) => {
      setTotalUsers(res.data.data.length);
    });

    axios.get(`${API_BASE_URL}/AllPosts`).then((res) => {
      setPosts(res.data.data.length);
    });

    axios.get(`${API_BASE_URL}/admin/pending-posts`).then((res) => {
      setNumOfPendingPost(res.data.data.length);
      if (Array.isArray(res.data.data)) {
        setPendingPosts(res.data.data);
      }
    });
  }, []);

  const handleApprove = (postId) => {
    axios.put(`${API_BASE_URL}/admin/approve-posts/${postId}`).then(() => {
      setPendingPosts(pendingPosts.filter((p) => p._id !== postId));
      setNumOfPendingPost((prev) => prev - 1);
      setPosts((prev) => prev + 1);
      setCurrentPost(null);
      Swal.fire("Approved", "Post approved successfully!", "success");
    });
  };

  const handleDelete = (postId) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Post will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then((res) => {
      if (res.isConfirmed) {
        axios.delete(`${API_BASE_URL}/DeletePost/${postId}`).then(() => {
          setPendingPosts(pendingPosts.filter((p) => p._id !== postId));
          setNumOfPendingPost((prev) => prev - 1);
          setCurrentPost(null);
          Swal.fire("Deleted", "Post has been deleted.", "success");
        });
      }
    });
  };

  return (
    <div className="clean-admin-layout">
      <AdminNavbar />
      <div className="clean-admin-main">
        <h2 className="clean-admin-heading">Admin Dashboard</h2>
        <div className="clean-admin-grid">
          <div className="clean-admin-box">
            <span className="clean-admin-label">Total Users</span>
            <span className="clean-admin-value">{totalUsers}</span>
          </div>
          <div className="clean-admin-box">
            <span className="clean-admin-label">Total Posts</span>
            <span className="clean-admin-value">{posts}</span>
          </div>
          <div className="clean-admin-box">
            <span className="clean-admin-label">Pending Posts</span>
            <span className="clean-admin-value">{numOfPendingPost}</span>
            <button
              className="clean-admin-btn-view"
              onClick={() => setShowPendingListModal(true)}
            >
              View
            </button>
          </div>
        </div>

        {showPendingListModal && (
          <div className="clean-modal-overlay">
            <div className="clean-modal-box">
              <h3>Pending Posts</h3>
              {pendingPosts.length > 0 ? (
                <ul className="clean-pending-list">
                  {pendingPosts.map((post) => (
                    <li key={post._id}>
                      <span>{post.title}</span>
                      <button
                        className="clean-admin-btn-view"
                        onClick={() => setCurrentPost(post)}
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending posts</p>
              )}
              <button
                className="clean-admin-btn-close"
                onClick={() => setShowPendingListModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {currentPost && (
          <div className="clean-modal-overlay">
            <div className="clean-modal-box">
              <h3>{currentPost.title}</h3>
              <p><strong>Author:</strong> {currentPost.userDetails?.username}</p>
              <p><strong>Category:</strong> {currentPost.category}</p>
              <p><strong>Content:</strong> {currentPost.content}</p>
              <div className="clean-action-btns">
                <button onClick={() => handleApprove(currentPost._id)}>Approve</button>
                <button onClick={() => handleDelete(currentPost._id)} className="delete">Delete</button>
                <button onClick={() => setCurrentPost(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
