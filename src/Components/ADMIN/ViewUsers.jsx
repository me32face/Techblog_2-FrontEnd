import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import Footer from '../STATIC/Footer';
import axios from 'axios';
import "../../Assets/Styles/ViewUsers.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function ViewUsers() {

  const isAdmin = sessionStorage.getItem("isAdminLoggedIn");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;


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
  }, []);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .post(`${API_BASE_URL}/ViewUsers`)
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error fetching users");
      });
  }, []);

  const handleDelete = (userId, fullName) => {
  Swal.fire({
    title: `Delete ${fullName}?`,
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`${API_BASE_URL}/DeleteUser/${userId}`)
        .then((res) => {
          if (res.data.status === 200) {
            Swal.fire("Deleted!", res.data.msg, "success");
            // Refresh user list
            setUsers((prev) => prev.filter((u) => u._id !== userId));
          } else {
            Swal.fire("Error!", res.data.msg, "error");
          }
        })
        .catch((err) => {
          Swal.fire("Failed!", "An error occurred.", "error");
        });
    }
  });
};


  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-home-main-content">
        <div className="View-User-main-page">
          <div className="UserDetailsTable">
            <table>
              <thead className="BorderSetting-viewUsersPage">
                <tr>
                  <th className="thBorderSetting-viewUsersPage">Name</th>
                  <th className="thBorderSetting-viewUsersPage">Username</th>
                  <th className="thBorderSetting-viewUsersPage">Email</th>
                  <th className="thBorderSetting-viewUsersPage">.</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-info ViewProfileButton me-2"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal-${user._id}`}
                      >
                        View Profile
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user._id, user.fullName)}
                      >
                        Delete
                      </button>

                      <div
                        className="modal fade"
                        id={`modal-${user._id}`}
                        tabIndex="-1"
                        aria-labelledby={`modalLabel-${user._id}`}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-xl custom-modal-width modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={`modalLabel-${user._id}`}
                              >
                                Profile
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="profile-container container">
                                <div className="profile-card row justify-content-center align-items-center shadow p-4 rounded">
                                  <div className="col-md-4 text-center">
                                    <img
                                      src={user.image || "fallback-image-url-or-placeholder.png" || "https://via.placeholder.com/400x200"}
                                      alt="No Profile Picture Uploaded"
                                      className="profile-picture w-100 h-auto mb-3 rounded"
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <div className="profile-info">
                                      <h3 className="profile-name mb-3">
                                        {user.fullName}
                                      </h3>
                                      <p className="profile-id mb-2">
                                        <strong>ID: </strong>
                                        {user._id}
                                      </p>
                                      <p className="profile-email mb-2">
                                        <strong>Email: </strong>
                                        {user.email}
                                      </p>
                                      <p className="profile-username mb-2">
                                        <strong>Username: </strong>
                                        {user.username}
                                      </p>
                                      <p className="profile-username mb-2">
                                        <strong>Password: </strong>
                                        {user.password}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUsers;
