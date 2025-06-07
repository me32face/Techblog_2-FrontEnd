// src/STATIC/Footer.js
import React from "react";
import "../../Assets/Styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-techblog">
      <div className="footer-container-techblog">
        <div className="footer-brand-techblog">
          <h2>TechBlog</h2>
          <p>Your daily dose of tech articles, tutorials, and guides.</p>
        </div>

        <div className="footer-links-techblog">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/AllPosts">All Posts</a></li>
            <li><a href="/NewPost">Add New Post</a></li>
            <li><a href="/UserProfile">Profile</a></li>
          </ul>
        </div>

        <div className="footer-social-techblog">
          <h4>Connect</h4>
          <div className="footer-icons-techblog">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-techblog">
        <p>&copy; {new Date().getFullYear()} TechBlog. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
