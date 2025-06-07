import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Assets/Styles/UserLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../STATIC/Navbar';
import Footer from '../STATIC/Footer';
import Swal from 'sweetalert2';

function UserLogin() {
  const navigate = useNavigate();
  const loginId = localStorage.getItem("userId");

  const API_BASE_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
      if (loginId) {
          Swal.fire({
              title: 'Warning!',
              text: `You are logged in. Cannot access the login page.`,
              icon: 'warning',
              confirmButtonText: 'Okay',
              // timer: 2000, // Optional: Auto close after 2 seconds
              showConfirmButton: true 
          })
          .then(() => {
              navigate("/UserProfile");
          });
      }
  }, [loginId, navigate, Swal]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const onValueChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const LoginClick = (e) => {
    e.preventDefault();

    if(formData.password.length<6){
        Swal.fire({
            title: 'Warning!',
            text: 'Password should contain atleast 6 characters',
            icon: 'warning',
            confirmButtonText: 'Okay',
            // timer: 2000, // Optional: Auto close after 2 seconds
            showConfirmButton: true 
        })
        return;
    }

    axios
      .post(`${API_BASE_URL}/userLogin`, formData)
      .then((up) => {
        if (up.data.status === 200) {
          localStorage.setItem("userId", up.data.data._id);
          sessionStorage.setItem("userId", up.data.data._id);
          localStorage.setItem("username", up.data.data.username);
          Swal.fire({
              title: 'Success!',
              text: 'Logged in successfully',
              icon: 'success',
              confirmButtonText: 'Okay',
              timer: 2000, // Optional: Auto close after 2 seconds
              showConfirmButton: true 
          }).then(() => {
              navigate("/");
          });
        } else if (up.data.status === 404) {
          Swal.fire({
            title: 'Warning!',
            text: 'Email id not registered. Click on register',
            icon: 'warning',
            confirmButtonText: 'Okay',
            // timer: 2000, // Optional: Auto close after 2 seconds
            showConfirmButton: true 
          })
        } else if (up.data.status === 400) {
          Swal.fire({
            title: 'Warning!',
            text: 'Password incorrect. Try again',
            icon: 'warning',
            confirmButtonText: 'Okay',
            // timer: 2000, // Optional: Auto close after 2 seconds
            showConfirmButton: true 
          })
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Warning!',
          text: 'Server error',
          icon: 'warning',
          confirmButtonText: 'Okay',
          // timer: 2000, // Optional: Auto close after 2 seconds
          showConfirmButton: true 
        })      });
  };

  return (
    <div className="userlogin-wrapper">
      <Navbar />
      <div className="userlogin-fullscreen d-flex justify-content-center align-items-center">
        <div className="userlogin-form animate__animated animate__fadeInDown">
          <h3 className="userlogin-title text-center">User Login</h3>

          <form onSubmit={LoginClick}>
            <div className="form-group mb-3">
              <label htmlFor="UserEmail">Email</label>
              <input
                type="email"
                id="UserEmail"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={onValueChange}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="UserPassword">Password</label>
              <input
                type="password"
                id="UserPassword"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={onValueChange}
                required
              />
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary userlogin-btn">
                Login
              </button>
            </div>

            <div className="text-center">
              <a href="/ForgotPassword" className="userlogin-link d-block">Forgot Password?</a>
              <a href="/User-Registration" className="userlogin-link">New user? Register here</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserLogin;
