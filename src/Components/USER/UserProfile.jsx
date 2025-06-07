import React, { useEffect, useState } from 'react';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import "../../Assets/Styles/UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();
  const loginId = localStorage.getItem("userId");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [showModal, setShowModal] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [editUser, setEditUser] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    dob: '',
    bio: '',
    socialLinks: '',
  });

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (!loginId) {
      Swal.fire({
        title: 'Please Login',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/UserLogin"));
    }
  }, [loginId, navigate]);

  useEffect(() => {
    if (loginId) {
      axios.post(`${API_BASE_URL}/UserProfile/${loginId}`)
        .then(res => setUser(res.data.data))
        .catch(() => Swal.fire('Oops!', 'Failed to load user data.', 'error'));

      axios.post(`${API_BASE_URL}/UsersPosts/${loginId}`)
        .then(res => setPosts(res.data.data))
        .catch(() => Swal.fire('Oops!', 'Failed to load posts.', 'error'));

      axios.get(`${API_BASE_URL}/saved/${loginId}`)
        .then(res => setSavedPosts(res.data.data || []))
        .catch(() => Swal.fire('Oops!', 'Failed to load saved posts.', 'error'));
    }
  }, [loginId]);

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "";

  const handleDeletePost = (postId) => {
    Swal.fire({
      title: 'Delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e74c3c',
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`${API_BASE_URL}/DeletePost/${postId}`)
          .then(() => {
            setPosts(posts.filter(post => post._id !== postId));
            Swal.fire('Deleted!', 'Post has been deleted.', 'success');
          })
          .catch(() => Swal.fire('Error', 'Could not delete post.', 'error'));
      }
    });
  };

  const handleEditClick = () => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleChange = e => setEditUser({ ...editUser, [e.target.name]: e.target.value });

  const handleSave = () => {
    axios.put(`${API_BASE_URL}/UpdateUserProfile/${loginId}`, editUser)
      .then(res => {
        setUser(res.data.data);
        setShowModal(false);
        Swal.fire('Success', 'Profile updated!', 'success');
      })
      .catch(() => Swal.fire('Error', 'Could not update profile.', 'error'));
  };

  return (
    <div className="upa-wrapper">
      <Navbar />

      <main className="upa-main">
        <aside className="upa-sidebar">
          <div className="upa-avatar-wrapper">
            <img
              src={user?.image || "https://via.placeholder.com/150"}
              alt="Profile"
              className="upa-avatar"
            />
          </div>
          <h2 className="upa-fullname">{user?.fullName || "User Name"}</h2>
          <p className="upa-username">@{user?.username || "username"}</p>
          <p className="upa-bio">{user?.bio || "No bio available."}</p>

          <ul className="upa-user-info-list">
            <li><strong>Email:</strong> {user?.email || "N/A"}</li>
            <li><strong>Phone:</strong> {user?.phone || "-"}</li>
            <li><strong>DOB:</strong> {formatDate(user?.dob)}</li>
            <li><strong>Social:</strong> {user?.socialLinks || "N/A"}</li>
          </ul>

          <div className="upa-buttons-group">
            <button className="upa-btn-primary" onClick={() => navigate("/NewPost")}>New Post</button>
            <button className="upa-btn-secondary" onClick={handleEditClick}>Edit Profile</button>
            <button className="upa-btn-primary" onClick={() => navigate("/ForgotPassword")}>Forgot Password</button>
          </div>
        </aside>

        <section className="upa-content">
          <header className="upa-tab-header">
            <button
              className={`upa-tab-btn ${!showSaved ? "upa-tab-active" : ""}`}
              onClick={() => setShowSaved(false)}
            >
              Your Posts
            </button>
            <button
              className={`upa-tab-btn ${showSaved ? "upa-tab-active" : ""}`}
              onClick={() => setShowSaved(true)}
            >
              Saved Posts
            </button>
          </header>

          <div className="upa-posts-container">
            {(showSaved ? savedPosts : posts).length > 0 ? (
              (showSaved ? savedPosts : posts).slice().reverse().map(item => {
                const post = showSaved ? item.postId : item;
                return (
                  <article className="upa-post-card" key={post._id}>
                    <img
                      src={post.image || "https://via.placeholder.com/300x180"}
                      alt={post.title}
                      className="upa-post-image"
                    />
                    <div className="upa-post-details">
                      <h3>{post.title}</h3>
                      <p>{post.content?.substring(0, 120)}...</p>
                    </div>
                    <div className="upa-post-actions">
                      <button
                        className="upa-btn-info"
                        onClick={() => window.open(`/Post/${post._id}`)}
                      >
                        View
                      </button>
                      {!showSaved && (
                        <button
                          className="upa-btn-danger"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="upa-no-posts-msg">{showSaved ? "No saved posts found." : "No posts found."}</p>
            )}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="upa-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="upa-modal-content" onClick={e => e.stopPropagation()}>
            <header className="upa-modal-header">
              <h2>Edit Profile</h2>
              <button className="upa-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </header>
            <form className="upa-modal-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <input type="text" name="fullName" value={editUser.fullName} onChange={handleChange} placeholder="Full Name" required />
              <input type="text" name="username" value={editUser.username} onChange={handleChange} placeholder="Username" required />
              <input type="email" name="email" value={editUser.email} onChange={handleChange} placeholder="Email" required />
              <input type="tel" name="phone" value={editUser.phone} onChange={handleChange} placeholder="Phone" />
              <input type="date" name="dob" value={editUser.dob ? editUser.dob.slice(0, 10) : ""} onChange={handleChange} />
              <textarea name="bio" value={editUser.bio} onChange={handleChange} placeholder="Bio" />
              <input type="text" name="socialLinks" value={editUser.socialLinks} onChange={handleChange} placeholder="Social Links" />
              <div className="upa-modal-buttons">
                <button type="button" className="upa-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="upa-btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default UserProfile;
