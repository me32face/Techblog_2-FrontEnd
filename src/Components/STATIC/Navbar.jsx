import React, { useState, useEffect } from "react";
import "../../Assets/Styles/Navbar.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


// Debounce utility
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}


function Navbar() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
      setUsername("");
      Swal.fire({
        icon: "success",
        title: "Logged out successfully!",
        text: "You have been logged out.",
        timer: 500,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "An error occurred while logging out.",
      });
    }
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/AllPosts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };



  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navbar for desktop */}
      <nav className="top-navbar-techblog">
        <div className="top-navbar-container">
          <a href="/" className="brand-techblog">
            <i>TechBlog</i>
          </a>

          {/* Desktop links */}
          <ul className="nav-links-techblog">
            <li>
              <a href="/" className="nav-link-techblog">
                Home
              </a>
            </li>
            <li>
              <a href="/NewPost" className="nav-link-techblog">
                Add New Post
              </a>
            </li>
            <li>
              <a href="/AllPosts" className="nav-link-techblog">
                All Posts
              </a>
            </li>
            <li>
              <a href="/#recent-posts" className="nav-link-techblog">
                Recent Posts
              </a>
            </li>
          </ul>

          <form
            className="search-bar-techblog desktop-only"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-techblog"
            />
            <button type="submit" className="search-btn-techblog">🔍</button>
          </form>

          {/* Right side desktop user actions */}
          <div className="user-actions-techblog desktop-only">
            {username ? (
              <>
                <a href="/UserProfile" className="username-box-techblog">
                  <i className="fas fa-user"></i> {username}
                </a>
                <button
                  onClick={handleLogout}
                  className="logout-btn-techblog"
                  aria-label="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </>
            ) : (
              <div className="auth-btns-techblog">
                <a href="/User-Registration" className="btn-register-techblog">
                  Register
                </a>
                <a href="/UserLogin" className="btn-login-techblog">
                  Login
                </a>
              </div>
            )}
          </div>

          {/* Hamburger toggler for mobile */}
          <button
            className="hamburger-btn-techblog mobile-only"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
          >
            <span className={`hamburger-line ${sidebarOpen ? "open" : ""}`}></span>
            <span className={`hamburger-line ${sidebarOpen ? "open" : ""}`}></span>
            <span className={`hamburger-line ${sidebarOpen ? "open" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay-techblog ${sidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar menu */}
      <aside className={`sidebar-techblog ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header-techblog">
          <a href="/" className="brand-sidebar-techblog" onClick={closeSidebar}>
            <i>TechBlog</i>
          </a>
          <button
            className="close-sidebar-btn-techblog"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>

        <nav className="sidebar-nav-techblog">
          <ul>
            <li>
              <a href="/" className="sidebar-link-techblog" onClick={closeSidebar}>
                Home
              </a>
            </li>
            <li>
              <a
                href="/NewPost"
                className="sidebar-link-techblog"
                onClick={closeSidebar}
              >
                Add New Post
              </a>
            </li>
            <li>
              <a
                href="/AllPosts"
                className="sidebar-link-techblog"
                onClick={closeSidebar}
              >
                All Posts
              </a>
            </li>
            <li>
              <a
                href="/#recent-posts"
                className="sidebar-link-techblog"
                onClick={closeSidebar}
              >
                Recent Posts
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-user-actions-techblog">
          {username ? (
            <>
              <a
                href="/UserProfile"
                className="profile-link-sidebar-techblog"
                onClick={closeSidebar}
              >
                <i className="fas fa-user"></i> {username}
              </a>
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="logout-btn-sidebar-techblog"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="auth-btns-sidebar-techblog">
              <a
                href="/User-Registration"
                className="btn-register-sidebar-techblog"
                onClick={closeSidebar}
              >
                Register
              </a>
              <a
                href="/UserLogin"
                className="btn-login-sidebar-techblog"
                onClick={closeSidebar}
              >
                Login
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
