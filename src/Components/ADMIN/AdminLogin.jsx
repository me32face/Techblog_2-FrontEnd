import React, { useState } from 'react';
import '../../Assets/Styles/AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleLoginSuccess = () => {
    sessionStorage.setItem("isAdminLoggedIn", true);
    Swal.fire({
      title: 'Logged in ✅!',
      text: 'Welcome',
      icon: 'success',
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      navigate('/dashboard');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');  // clear previous errors

    fetch(`${API_BASE_URL}/AdminLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (res.status === 200) {
          handleLoginSuccess();
        } else if (res.status === 401) {
          setError('Invalid credentials');
          Swal.fire({
            title: 'Login Failed',
            text: 'Invalid username or password',
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        } else {
          setError('Something went wrong');
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong, please try again later',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      })
      .catch(() => {
        setError('Network error');
        Swal.fire({
          title: 'Network Error',
          text: 'Please check your internet connection and try again',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  };

  return (
    <div className="techblog-admin-login-container">
      <form onSubmit={handleSubmit} className="techblog-admin-login-form">
        <h2 className="techblog-admin-login-title">Admin Login</h2>
        
        {error && (
          <p className="techblog-admin-login-error">{error}</p>
        )}

        <div className="techblog-admin-input-group">
          <label htmlFor="techblog-username" className="techblog-admin-label">
            Username
          </label>
          <input
            type="text"
            id="techblog-username"
            className="techblog-admin-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="techblog-admin-input-group">
          <label htmlFor="techblog-password" className="techblog-admin-label">
            Password
          </label>
          <input
            type="password"
            id="techblog-password"
            className="techblog-admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="techblog-admin-login-button"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;