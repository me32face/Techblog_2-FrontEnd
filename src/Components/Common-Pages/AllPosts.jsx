import React, { useEffect, useState } from 'react';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import axios from 'axios';
import "../../Assets/Styles/AllPosts.css";
import { useLocation } from 'react-router-dom';
import CategoryBar from './CategoryBar';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const searchQuery = queryParams.get("search")?.toLowerCase() || "";


  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/AllPosts`)
      .then(res => {
        setPosts(res.data.data);
      })
      .catch(err => console.error("Failed to fetch posts", err));
  }, []);

  useEffect(() => {
    const apiURL = selectedCategory
      ? `${API_BASE_URL}/category/${selectedCategory}`
      : `${API_BASE_URL}/AllPosts`;

    axios.get(apiURL).then((res) => {
      if (res.data && res.data.data) {
        setPosts(res.data.data);
      }
    });
  }, [selectedCategory]);

  useEffect(() => {
    const apiURL = selectedCategory
      ? `${API_BASE_URL}/category/${selectedCategory}`
      : `${API_BASE_URL}/AllPosts`;

    axios.get(apiURL).then((res) => {
      if (res.data && res.data.data) {
        let filtered = res.data.data;
        if (searchQuery) {
          filtered = filtered.filter((post) =>
            post.title.toLowerCase().includes(searchQuery) ||
            post.content.toLowerCase().includes(searchQuery) ||
            post.category?.toLowerCase().includes(searchQuery)
          );
        }
        setPosts(filtered);
      }
    });
  }, [selectedCategory, searchQuery]);


  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <CategoryBar/>
      <main className="allposts-wrapper">
        <h2 className="allposts-page-title">All Blog Posts</h2>
        {searchQuery && (
          <p className="allposts-search-status">
            Showing results for "<strong>{searchQuery}</strong>"
          </p>
        )}
        <div className="container">
          <div className="row">
            {posts.length === 0 ? (
              <p className="no-posts-message">
                {selectedCategory
                  ? `No posts found for "${selectedCategory}".`
                  : "No posts available."}
              </p>
            ) : (
              posts.slice().reverse().map((post) => (
                <div className="col-md-4 mb-4 allposts-col" key={post._id}>
                  <article className="allposts-card">
                    <div className={`allposts-image-wrapper ${!post.image ? 'no-image' : ''}`}>
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="allposts-image"
                        />
                      ) : (
                        <div className="no-image-placeholder">No Image Available</div>
                      )}
                      <span className="allposts-category-badge">{post.category}</span>
                    </div>
                    <div className="allposts-content">
                      <h3 className="allposts-title" title={post.title}>
                        {post.title.length > 70 ? post.title.substring(0, 70) + "..." : post.title}
                      </h3>
                      <p className="allposts-snippet">
                        {post.content.length > 120 ? post.content.substring(0, 120) + "..." : post.content}
                      </p>
                    </div>
                    <footer className="allposts-footer">
                      <span className="allposts-author">By <strong>{post.userDetails?.username || "Unknown"}</strong></span>
                      <time className="allposts-date" dateTime={post.datePosted}>
                        {formatDate(post.datePosted)}
                      </time>
                    </footer>
                    <div className="allposts-viewmore-wrapper">
                      <a href={`/post/${post._id}`} className="allposts-viewmore-btn">View More</a>
                    </div>
                  </article>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AllPosts;
