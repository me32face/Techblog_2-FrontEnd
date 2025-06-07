import React, { useEffect, useState } from 'react';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import "../../Assets/Styles/NewPost.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ Import Swal
import CommentSection from './CommentSection';

function NewPost() {

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must be a user and  logged in to access this page.",
      }).then(() => {
        navigate("/UserLogin");
      });
    }
  }, []);

  const usersId = localStorage.getItem("userId");

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [newPostData, setNewPostData] = useState({
    userId: `${usersId}`,
    title: '',
    content: '',
    category: '',
    hashtags: '',
    image: ''
  });

  const handleChange = (e) => {
    setNewPostData({
      ...newPostData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPostData({ ...newPostData, image: file });
  };

  const SubmitForm = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to publish this post?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_BASE_URL}/AddPost`, newPostData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          .then((up) => {
            if (up.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Post Published!",
                text: "Your blog post has been successfully published. Once approved by admin, it will be on the profile",
                confirmButtonText: "View Posts"
              }).then(() => {
                navigate("/UserProfile");
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save the post. Please try again.",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "Something went wrong. Contact admin.",
            });
          });
      }
    });
  };

  return (
<div>
  <Navbar />
  <div className="npd-wrapper">
    <div className="npd-card">
      <div className="npd-sidebar-accent"></div>
      <div className="npd-content">
        <h2 className="npd-title">Write Your New Blog Post</h2>
        <form onSubmit={SubmitForm}>

          <div className="npd-group">
            <label htmlFor="title" className="npd-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPostData.title}
              onChange={handleChange}
              className="npd-input"
              required
              placeholder="Enter blog title"
            />
          </div>

          <div className="npd-group">
            <label htmlFor="content" className="npd-label">Content</label>
            <textarea
              id="content"
              name="content"
              value={newPostData.content}
              onChange={handleChange}
              className="npd-textarea"
              required
              placeholder="Write your blog content here..."
            />
          </div>

          <div className="npd-group">
            <label htmlFor="category" className="npd-label">Category</label>
            <select
              id="category"
              name="category"
              value={newPostData.category}
              onChange={handleChange}
              className="npd-select"
              required
            >
              <option value="">Select a category</option>
              <option value="Programming">Programming</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="Web-Development">Web Development</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Mobile-Phones">Mobile Phones</option>
              <option value="Technology">Technology</option>
              <option value="News">News</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="npd-group">
            <label htmlFor="hashtags" className="npd-label">Hashtags</label>
            <input
              type="text"
              id="hashtags"
              name="hashtags"
              value={newPostData.hashtags}
              onChange={handleChange}
              className="npd-input"
              placeholder="e.g., tech, AI, webdev"
            />
          </div>

          <div className="npd-group">
            <label htmlFor="image" className="npd-label">Upload Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="npd-input"
              accept="image/*"
            />
          </div>

          <button type="submit" className="npd-submit-btn">Publish Post</button>
        </form>
      </div>
    </div>
  </div>
  <Footer />
</div>


  );
}

export default NewPost;
