// src/Components/CategoryPosts.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../Assets/Styles/CategoryPosts.css";

function CategoryPosts() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/category/${category}`)
      .then((res) => {
        setPosts(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="category-posts-wrapper-techblog">
      <h2 className="category-posts-heading-techblog">
        Posts in "{category.replace("-", " ")}"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found in this category.</p>
      ) : (
        <div className="category-posts-list-techblog">
          {posts.map((post) => (
            <div key={post._id} className="category-post-card-techblog">
              <img src={post.image} alt="Post" className="category-post-img-techblog" />
              <div className="category-post-content-techblog">
                <h4>{post.title}</h4>
                <p>By: {post.userDetails?.username || "Unknown"}</p>
                <a href={`/singlepost/${post._id}`} className="view-more-btn-techblog">
                  View Post
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPosts;
