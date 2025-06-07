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

  const fetchDashboardData = () => {
    axios
      .post(`${API_BASE_URL}/ViewUserData`)
      .then((res) => setTotalUsers(res.data.data.length))
      .catch((err) => console.error("Error loading users:", err));

    axios
      .get(`${API_BASE_URL}/AllPosts`)
      .then((res) => setPosts(res.data.data.length))
      .catch((err) => console.error("Error loading posts", err));

    axios
      .get(`${API_BASE_URL}/admin/pending-posts`)
      .then((res) => {
        setNumOfPendingPost(res.data.data.length);
        if (Array.isArray(res.data.data)) {
          setPendingPosts(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching pending posts:", err));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = (postId) => {
    axios
      .put(`${API_BASE_URL}/admin/approve-posts/${postId}`)
      .then(() => {
        const updated = pendingPosts.filter((post) => post._id !== postId);
        setPendingPosts(updated);
        setNumOfPendingPost((prev) => prev - 1);
        setPosts((prev) => prev + 1);
        setCurrentPost(null);

        Swal.fire({
          title: "Approved!",
          text: "Post has been approved successfully.",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      })
      .catch((err) => console.error("Error approving post:", err));
  };

  const handleDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/DeletePost/${postId}`)
          .then(() => {
            const updated = pendingPosts.filter((post) => post._id !== postId);
            setPendingPosts(updated);
            setNumOfPendingPost((prev) => prev - 1);
            setCurrentPost(null);

            Swal.fire({
              title: "Deleted!",
              text: "Post has been deleted.",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          })
          .catch((err) => {
            console.error("Error deleting post:", err);
            Swal.fire("Error", "Failed to delete the post.", "error");
          });
      }
    });
  };

  return (
    <div className="admin-home-layout">
      <AdminNavbar />
      <div className="admin-home-main-content">
        <h2 className="admin-home-title">Admin Dashboard</h2>
        <div className="admin-home-cards">
          <div className="admin-home-card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
          <div className="admin-home-card">
            <h3>Total Posts</h3>
            <p>{posts}</p>
          </div>
          <div className="admin-home-card">
            <h3>Pending Posts</h3>
            <p>{numOfPendingPost}</p>
            <button onClick={() => setShowPendingListModal(true)}>View</button>
          </div>
        </div>

        {/* Modal: List of Pending Posts */}
        {showPendingListModal && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h4>Pending Posts</h4>
              <ul>
                {pendingPosts.length > 0 ? (
                  pendingPosts.map((post) => (
                    <li key={post._id}>
                      {post.title}{" "}
                      <button
                        onClick={() => {
                          console.log("Selected post:", post); // 👈 Add this line
                          setCurrentPost(post);
                        }}
                      >
                        View
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No pending posts.</p>
                )}
              </ul>
              <button onClick={() => setShowPendingListModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* Modal: View Single Post */}
        {currentPost && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h4>Post Details</h4>
              <p>
                <strong>Title:</strong> {currentPost.title}
              </p>
              <p>
                <strong>Author:</strong> {currentPost.userDetails?.username}
              </p>
              <p>
                <strong>Category:</strong> {currentPost.category}
              </p>
              <p>
                <strong>Content:</strong> {currentPost.content}
              </p>
              <div className="admin-modal-buttons">
                <button onClick={() => handleApprove(currentPost._id)}>Approve</button>
                <button onClick={() => handleDelete(currentPost._id)} className="delete-btn">
                  Delete
                </button>
                <button onClick={() => setCurrentPost(null)} className="close-btn">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
