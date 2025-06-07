import React, { useEffect, useState } from "react";
import Navbar from "../STATIC/Navbar";
import Footer from "../STATIC/Footer";
import axios from "axios";
import "../../Assets/Styles/Common.css";
import "../../Assets/Styles/Home.css";
import CategoryBar from "./CategoryBar";

function Home() {
  const userName = localStorage.getItem("username") || "Guest";
  const [allPosts, setAllPosts] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/AllPosts`)
      .then((response) => {
        setAllPosts(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch all posts", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="container">
        <CategoryBar/>
        <section className="home-hero">
          <h1>Welcome {userName}</h1>
          <h2>Explore. Learn. Share.</h2>
          <p>Your hub for the latest in tech, tutorials, and developer insights.</p>
          <a href="/AllPosts" className="btn btn-primary btn-cta">
            Let's Start
          </a>
        </section>

        <section className="posts-section">
          <h2>Recent Posts</h2>
          {allPosts.length > 0 ? (
            <div className="posts-grid">
              {allPosts
                .slice()
                .reverse()
                .map((post) => (
                  <article
                    className="post-card"
                    key={post._id}
                    onClick={() => (window.location.href = `/post/${post._id}`)}
                    tabIndex={0}
                    role="button"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") window.location.href = `/post/${post._id}`;
                    }}
                  >
                    <h3 className="post-title">{post.title.substring(0, 70)}</h3>
                    <div className="post-meta">
                      <div className="author-avatar">
                        {post.userDetails?.username?.[0] || "U"}
                      </div>
                      <span>{post.userDetails?.username || "Unknown Author"}</span>
                      <span>| {new Date(post.datePosted).toLocaleDateString()} {new Date(post.datePosted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      
                    </div>
                    <p className="post-excerpt">{post.content.substring(0, 140)}...</p>
                    <span></span>
                    <span className="category-badge">{post.category || "General"}</span>
                  </article>

                ))}
            </div>
          ) : (
            <p className="text-center">No posts available.</p>
          )}
        </section>
        
      </main>
      <Footer />
    </>
  );
}

export default Home;
