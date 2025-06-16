// src/Components/STATIC/LoadingScreen.jsx
import React from 'react';
import '../../Assets/Styles/LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <h2>Starting up the server...</h2>
      <p>Please wait a moment ⏳</p>
    </div>
  );
}

export default LoadingScreen;
