import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Assets/Styles/ManagePosts.css";
import "./AdminNavbar"
import AdminNavbar from "./AdminNavbar.jsx";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";


function ManagePosts() {

  const isAdmin = sessionStorage.getItem("isAdminLoggedIn");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL;


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

  const [posts, setPosts] = useState([]);

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
          .then((response) => {
            console.log(response);
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


  const handleView = (id) => {
    window.open(`/post/${id}`, "_blank"); // Opens the blog post in a new tab
  };

  return (

    <div>
        <AdminNavbar/>
        <div className="unique-manage-posts-container">
            <h1 className="unique-manage-posts-title">Manage Posts</h1>

            <div className="unique-posts-list">
                {posts
                .slice()
                .reverse()
                .map((post) => (
                <div className="unique-post-card" key={post._id}>
                    <h3 className="unique-post-title">{post.title}</h3>
                    <p className="unique-post-author">By: {post.userDetails?.username}</p>
                    <p className="unique-post-category">Category: {post.category}</p>

                    <div>
                        <div className="unique-post-actions">
                            <a href={`/post/${post._id}`} className=" btn unique-view-btn">View</a>
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="unique-delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default ManagePosts;
