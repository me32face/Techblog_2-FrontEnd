import React, { useState } from 'react';
import Navbar from '../STATIC/Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../Assets/Styles/ForgotPassword.css';
import Footer from '../STATIC/Footer';


function ForgotPassword() {

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const onValueChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const SubmitForm = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Password too short',
        text: 'The password should contain at least 6 characters.'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Password and Confirm Password must match.'
      });
      return;
    }

    axios
      .post(`${API_BASE_URL}/ForgotPassword`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful',
            text: 'You will be redirected to login.'
          }).then(() => {
            // Clear local storage items if any
            localStorage.removeItem('isUserLoggedIn');
            localStorage.removeItem('userId');

            navigate('/UserLogin');
          });
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Email Not Registered',
            text: 'The email provided is not registered.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Something went wrong. Please contact admin.'
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not connect to the server.'
        });
      });
    };

    return (
    <div>
        <Navbar/>
        <div className="forgot-bg-container">
            <div className="forgot-form-wrapper">
                <h2 className="forgot-form-title">Reset Password</h2>
                <form onSubmit={SubmitForm}>
                <div className="forgot-form-group">
                    <label className="forgot-form-label" htmlFor="email">Email Address:</label>
                    <input className="forgot-form-input" type="email" id="email" name="email" value={formData.email} onChange={onValueChange} placeholder="Enter your email" required />
                </div>

                <div className="forgot-form-group">
                    <label className="forgot-form-label" htmlFor="password">Password:</label>
                    <input className="forgot-form-input" type="password" id="password" name="password" value={formData.password} onChange={onValueChange} placeholder="Enter a password" required />
                </div>

                <div className="forgot-form-group">
                    <label className="forgot-form-label" htmlFor="confirmPassword">Confirm Password:</label>
                    <input className="forgot-form-input" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={onValueChange} placeholder="Confirm your password" required />
                </div>

                <button type="submit" className="forgot-form-submit">Submit</button>
                </form>
            </div>
        </div>
        <Footer/>
    </div>
    )
}

export default ForgotPassword
