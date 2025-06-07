import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import '../../Assets/Styles/SinglePost.css';
import CommentSection from './CommentSection';
import LikeDislikeButton from './LikeDislikeButton';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();


  const userDetails = {
    username: localStorage.getItem("username"),
    userId: localStorage.getItem("userId"),
    admin: sessionStorage.getItem("isAdminLoggedIn"),
  };

  useEffect(() => {
    axios
      .post(`${API_BASE_URL}/GetPostById/${id}`)
      .then((res) => setPost(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (!userDetails.userId) return;
    axios
      .get(`${API_BASE_URL}/saved/${userDetails.userId}`)
      .then((res) => {
        const savedPosts = res.data.data || [];
        const found = savedPosts.some(sp => sp.postId._id === id);
        setIsSaved(found);
      })
      .catch((err) => console.log(err));
  }, [id, userDetails.userId]);

  const handleSavePost = () => {
    axios
      .post(`${API_BASE_URL}/saved/save-post`, { userId: userDetails.userId, postId: id })
      .then(() => {
        setIsSaved(true);
        Swal.fire({
          title: 'Saved!',
          text: 'Post added to your saved list.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save post.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };

  const handleRemoveSavedPost = () => {
    axios
      .delete(`${API_BASE_URL}/saved/${userDetails.userId}/${id}`)
      .then(() => {
        setIsSaved(false);
        Swal.fire({
          title: 'Removed!',
          text: 'Post removed from your saved list.',
          icon: 'info',
          timer: 1000,
          showConfirmButton: false
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to remove saved post.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="blog-single-loading">Loading post...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="blog-single-container">
        <div className="blog-header-banner">
          <h1 className="blog-title">{post.title}</h1>
          <div className="blog-meta">
            <span
              className="sp-username"
              onClick={() => navigate(`/author/${post.userDetails._id}`)}
            >
              @{post.userDetails?.username || 'Unknown'}
            </span>
            <span className="blog-divider">|</span>
            <span>{formatDate(post.datePosted)}</span>
            {userDetails.userId && (
              <button
                className={`blog-save-btn ${isSaved ? 'saved' : ''}`}
                onClick={isSaved ? handleRemoveSavedPost : handleSavePost}
              >
                {isSaved ? '💾 Saved' : '🔖 Save'}
              </button>
            )}
          </div>
        </div>

        {localStorage.getItem("userId") === post.userDetails?._id && (
          <div className="blog-edit-link">
            <Link to={`/EditPost/${post._id}`} className="blog-edit-btn">Edit</Link>
          </div>
        )}

        <div className="blog-image-box">
          <img src={post.image || "https://via.placeholder.com/800x400"} alt={post.title} />
        </div>

        <div className="blog-content-body">
          {post.content.split('\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <div className="blog-tags">
          <span className="blog-chip">#{post.category}</span>
          <span className="blog-chip">#{post.hashtags}</span>
        </div>

        <div className="blog-reactions">
          <LikeDislikeButton postId={post._id} />
        </div>

        <div className="blog-comments">
          <CommentSection postId={post._id} userDetails={userDetails} postAuthorId={post.userId} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SinglePost;
