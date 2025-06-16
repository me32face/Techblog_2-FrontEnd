import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/Styles/UserRegistration.css';
import Navbar from '../STATIC/Navbar';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from '../STATIC/Footer';

function UserRegistration() {
    const Navigate = useNavigate();
    const loginId = localStorage.getItem("userId");

    useEffect(() => {
        if (loginId) {
            Swal.fire({
                title: 'Warning!',
                text: 'You have logged in. Cannot access the registration page.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            }).then(() => {
                Navigate("/UserProfile");
            });
        }
    }, [loginId, Navigate]);

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        image: "",
        bio: "",
        phone: "",
        dob: "",
        socialLinks: ""
    });

    const onValueChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const isValidFullName = (name) => /^[A-Za-z\s]{3,}$/.test(name);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => /^\d{10}$/.test(phone);
    const isValidPassword = (password) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
    const isPastDate = (dateString) => {
        const today = new Date();
        const inputDate = new Date(dateString);
        return inputDate < today;
    };

    const SubmitForm = (e) => {
        e.preventDefault();

        if (!isValidFullName(formData.fullName)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Full Name must be at least 3 characters and contain only letters and spaces.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        if (!isValidEmail(formData.email)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please enter a valid email address.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        if (formData.phone && !isValidPhone(formData.phone)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Phone number must be exactly 10 digits.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        if (formData.dob && !isPastDate(formData.dob)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Date of Birth must be a date in the past.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        if (formData.username.length < 4) {
            Swal.fire({
                title: 'Warning!',
                text: 'Username must be at least 4 characters long.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        if (!isValidPassword(formData.password)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Password must contain at least 6 characters, including 1 uppercase letter, 1 number, and 1 special character.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                title: 'Warning!',
                text: 'Passwords do not match.',
                icon: 'warning',
                confirmButtonText: 'Okay',
                showConfirmButton: true 
            });
            return;
        }

        axios
            .post(`${API_BASE_URL}/userRegistration`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then((up) => {
                if (up.data.status === 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'User Registration Successful. Login now',
                        icon: 'success',
                        confirmButtonText: 'Okay',
                        timer: 2000,
                        showConfirmButton: true 
                    }).then(() => {
                        Navigate("/UserLogin");
                    });
                } else if (up.data.status === 404) {
                    Swal.fire({
                        title: 'Warning!',
                        text: 'Email id already exists, try logging in',
                        icon: 'warning',
                        confirmButtonText: 'Okay',
                        timer: 2000,
                        showConfirmButton: true 
                    }).then(() => {
                        Navigate("/UserLogin");
                    });
                } else if (up.data.status === 400) {
                    Swal.fire({
                        title: 'Warning!',
                        text: 'An error occurred while saving data. Please try again later.',
                        icon: 'warning',
                        confirmButtonText: 'Okay',
                        showConfirmButton: true 
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({
                    title: 'Warning!',
                    text: 'Something went wrong. Contact admin.',
                    icon: 'warning',
                    confirmButtonText: 'Okay',
                    showConfirmButton: true 
                });
            });
    };

    return (
        <div>
            <Navbar />
            <div className="registration-form-background">
                <div className="registration-form-main">
                    <h2 className="registration-form-title">User Registration</h2>
                    <form>
                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="fullName">Full Name:</label>
                            <input className='registration-input' type="text" id="fullName" name="fullName" value={formData.fullName} onChange={onValueChange} placeholder="Enter your full name" required />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="email">Email Address:</label>
                            <input className='registration-input' type="email" id="email" name="email" value={formData.email} onChange={onValueChange} placeholder="Enter your email" required />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="username">Username:</label>
                            <input className='registration-input' type="text" id="username" name="username" value={formData.username} onChange={onValueChange} placeholder="Choose a username" required />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="password">Password:</label>
                            <input className='registration-input' type="password" id="password" name="password" value={formData.password} onChange={onValueChange} placeholder="Enter a password" required />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="confirmPassword">Confirm Password:</label>
                            <input className='registration-input' type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={onValueChange} placeholder="Confirm your password" required />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="profile-picture">Profile Picture:</label>
                            <input className='registration-input' type="file" id="profile-picture" name="image" onChange={handleImageChange} accept="image/*" />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="bio">Bio:</label>
                            <textarea className='registration-input' id="bio" name="bio" value={formData.bio} onChange={onValueChange} placeholder="Tell us about yourself..." />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="phone">Phone Number:</label>
                            <input className='registration-input' type="tel" id="phone" name="phone" value={formData.phone} onChange={onValueChange} placeholder="Enter your phone number" />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="dob">Date of Birth:</label>
                            <input className='registration-input' type="date" id="dob" name="dob" value={formData.dob} onChange={onValueChange} />
                        </div>

                        <div className="registration-form-group">
                            <label className='registration-label' htmlFor="socialLinks">Social Profile Links:</label>
                            <input className='registration-input' type="text" id="socialLinks" name="socialLinks" value={formData.socialLinks} onChange={onValueChange} placeholder="LinkedIn, GitHub, etc." />
                        </div>

                        <button className="registration-button" onClick={SubmitForm} type="submit">Register</button>

                        <p className="registration-link text-center"><a href="/UserLogin">Already a user? Login here</a></p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UserRegistration;
