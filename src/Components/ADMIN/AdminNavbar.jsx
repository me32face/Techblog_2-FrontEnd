import React, { useEffect, useState } from "react";
import "../../Assets/Styles/AdminNavbar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminNavbar() {
  const navigate = useNavigate();
  const [showHamburger, setShowHamburger] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHamburger(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
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
      <input type="checkbox" id="nav-admin-toggle" className="nav-admin-toggle" />

      <aside className="nav-admin-sidebar">
        <label htmlFor="nav-admin-toggle" className="nav-admin-close">&times;</label>
        <div className="nav-admin-logo">Admin Panel</div>
        <nav className="nav-admin-links">
          <a href="/dashboard" className="nav-admin-link">Dashboard</a>
          <a href="/ManageUsers" className="nav-admin-link">Manage Users</a>
          <a href="/ManagePosts" className="nav-admin-link">Manage Posts</a>
          <button onClick={handleLogout} className="nav-admin-link nav-admin-logout">Logout</button>
        </nav>
      </aside>

      <label
        htmlFor="nav-admin-toggle"
        className={`nav-admin-hamburger ${showHamburger ? "visible" : "hidden"}`}
      >
        &#9776;
      </label>
    </>
  );
}

export default AdminNavbar;
