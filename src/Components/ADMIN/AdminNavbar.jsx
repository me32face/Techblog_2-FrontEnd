import React, { useEffect, useState } from "react";
import "../../Assets/Styles/AdminNavbar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminNavbar() {
  
  const navigate = useNavigate();
  const [showHamburger, setShowHamburger] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setShowHamburger(false); // scrolling down
    } else {
      setShowHamburger(true); // scrolling up
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const AdminLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("isAdminLoggedIn");
        navigate("/AdminLogin");
        Swal.fire("Logged out!", "You have been successfully logged out.", "success");
      }
    });
  };

  return (
    <>
      <input type="checkbox" id="admin-sidebar-toggle" className="admin-sidebar-toggle" />

      <div className="sidebar-admin-navbar">
        <label htmlFor="admin-sidebar-toggle" className="admin-close-btn">
          &times;
        </label>
        <div className="sidebar-admin-logo">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-admin-links">
          <a href="/dashboard" className="sidebar-admin-link">Dashboard</a>
          <a href="/ManageUsers" className="sidebar-admin-link">Manage Users</a>
          <a href="/ManagePosts" className="sidebar-admin-link">Manage Posts</a>
          <button className="sidebar-admin-link logout-button" onClick={AdminLogout}>Logout</button>
        </nav>
      </div>

      <label
        htmlFor="admin-sidebar-toggle"
        className={`admin-hamburger-icon ${showHamburger ? "show" : "hide"}`}
      >
        &#9776;
      </label>
    </>
  );
}

export default AdminNavbar;
