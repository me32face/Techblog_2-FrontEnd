import React, { useEffect, useState } from "react";
import Navbar from "../STATIC/Navbar";
import Footer from "../STATIC/Footer";
import "../../Assets/Styles/SavedPosts.css";

function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/user/saved-posts/${userId}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.log("Error fetching saved posts:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="saved-posts-wrapper">
        <h2 className="saved-posts-title">Your Saved Posts</h2>

        {posts.length === 0 ? (
          <div className="no-saved-posts-message">You haven't saved any posts yet!</div>
        ) : (
          <div className="saved-posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="saved-post-card">
                <img
                  src={post.image || "https://via.placeholder.com/300x180"}
                  alt={post.title}
                  className="saved-post-image"
                />
                <div className="saved-post-content">
                  <h4 className="saved-post-heading">{post.title}</h4>
                  <p className="saved-post-desc">{post.description?.slice(0, 100)}...</p>
                  <a href={`/post/${post._id}`} className="saved-post-view-btn">
                    View Post
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SavedPosts;
