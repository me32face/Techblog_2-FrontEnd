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
            <a href="https://your-portfolio-url.com" target="_blank" rel="noopener noreferrer" title="Portfolio">
              <i className="fas fa-user-circle"></i>
            </a>
            <a href="https://www.instagram.com/your_username" target="_blank" rel="noopener noreferrer" title="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:your.email@example.com" title="Email">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="http://github.com/me32face" target="_blank" rel="noopener noreferrer" title="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/akshay-a-023a472a4" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
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
