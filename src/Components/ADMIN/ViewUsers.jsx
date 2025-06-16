import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import '../../Assets/Styles/ViewUsers.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ViewUsers() {
  const isAdmin = sessionStorage.getItem("isAdminLoggedIn");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
  }, [isAdmin, navigate]);

  useEffect(() => {
    axios.post(`${API_BASE_URL}/ViewUsers`)
      .then(res => setUsers(res.data.data))
      .catch(() => alert("Error fetching users"));
  }, []);

  const handleDelete = (userId, fullName) => {
    Swal.fire({
      title: `Delete ${fullName}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_BASE_URL}/DeleteUser/${userId}`).then(res => {
          if (res.data.status === 200) {
            Swal.fire("Deleted!", res.data.msg, "success");
            setUsers(prev => prev.filter(u => u._id !== userId));
          } else {
            Swal.fire("Error!", res.data.msg, "error");
          }
        }).catch(() => Swal.fire("Failed!", "An error occurred.", "error"));
      }
    });
  };

  return (
    <div className="vu-page-wrapper">
      <AdminNavbar />
      <div className="vu-main-content">
        <h2 className="vu-heading">All Registered Users</h2>
        <div className="vu-table-wrapper">
          <table className="vu-user-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="vu-view-btn" onClick={() => setSelectedUser(user)}>View</button>
                    <button className="vu-delete-btn" onClick={() => handleDelete(user._id, user.fullName)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="vu-modal-overlay">
            <div className="vu-modal">
              <div className="vu-modal-header">
                <h4>User Profile</h4>
                <button className="vu-close-btn" onClick={() => setSelectedUser(null)}>×</button>
              </div>
              <div className="vu-modal-body">
                <img
                  src={selectedUser.image || "https://via.placeholder.com/150"}
                  alt="No Profile Picture"
                  className="vu-profile-img"
                />
                <div className="vu-profile-info">
                  <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                  <p><strong>Username:</strong> {selectedUser.username}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>ID:</strong> {selectedUser._id}</p>
                  <p><strong>Password:</strong> {selectedUser.password}</p>
                </div>
              </div>
              <div className="vu-modal-footer">
                <button className="vu-close-btn-outline" onClick={() => setSelectedUser(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUsers;
