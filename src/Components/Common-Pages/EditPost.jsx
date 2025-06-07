import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import "../../Assets/Styles/EditPost.css";
import Swal from 'sweetalert2';


function EditPost() {
  
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: '',
    hashtags: '',
    
  });

  useEffect(() => {
    axios
      .post(`${API_BASE_URL}/GetPostById/${id}`)
      .then((res) => {
        const post = res.data.data;
        setPostData({
          title: post.title,
          content: post.content,
          category: post.category,
          hashtags: post.hashtags,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`${API_BASE_URL}/UpdatePost/${id}`, postData)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Updated!',
            text: 'Post updated successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
            timer: 1500,
            showConfirmButton: true
          });
          navigate(`/post/${id}`);
        } else if (res.status === 404) {
          Swal.fire({
            title: 'Not Found!',
            text: 'The post was not found',
            icon: 'error',
            confirmButtonText: 'Okay',
            showConfirmButton: true
          });
        } else if (res.status === 400) {
          Swal.fire({
            title: 'Missing Fields!',
            text: 'Please fill out all required fields.',
            icon: 'warning',
            confirmButtonText: 'Okay',
            showConfirmButton: true
          });
        } else {
          Swal.fire({
            title: 'Update Failed!',
            text: 'Failed to update the post. Try again later.',
            icon: 'warning',
            confirmButtonText: 'Okay',
            showConfirmButton: true
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Server Error!',
          text: 'Contact Admin or try again later.',
          icon: 'error',
          confirmButtonText: 'Okay',
          showConfirmButton: true
        });
      });
  };


  return (
    <div>
      <Navbar />
      <div className="editpost-container">
        <h2 className="editpost-heading">Edit Blog Post</h2>
        <form onSubmit={handleUpdate} className="editpost-form">
          <input
            type="text"
            name="title"
            value={postData.title}
            onChange={handleChange}
            placeholder="Post Title"
            className="editpost-input"
            required
          />

          <textarea
            name="content"
            value={postData.content}
            onChange={handleChange}
            rows="6"
            placeholder="Post Content"
            className="editpost-textarea"
            required
          ></textarea>

          <select
            name="category"
            value={postData.category}
            onChange={handleChange}
            className="editpost-select"
            required
          >
            <option value="">Select Category</option>
            <option value="Programming">Programming</option>
            <option value="AI">Artificial Intelligence</option>
            <option value="Web Development">Web Development</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Mobile Phones">Mobile Phones</option>
            <option value="Technology">Technology</option>
          </select>

          <input
            type="text"
            name="hashtags"
            value={postData.hashtags}
            onChange={handleChange}
            placeholder="Hashtags"
            className="editpost-input"
          />

          <div className="text-center">
            <button type="submit" className="editpost-button">
              Update Post
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditPost;